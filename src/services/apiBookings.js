import { getToday } from "../utils/helpers";
import supabase from "./supabase";
import { PAGE_SIZE } from "../utils/constants";

export async function getBookings({ filter, sortBy, page }) {
  let query = supabase
    .from("booking")
    .select(
      "id, created_at, startDate, endDate, numNights, numGuests, status, totalPrice, cabins(name), guests!booking_guestId_fkey(fullName, email)",
      { count: "exact" }
    );

  // FILTER
  if (filter) query = filter.method || "eq";

  // SORT
  if (sortBy)
    query = query.order(sortBy.field, {
      ascending: sortBy.direction === "asc",
    });

  if (page) {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error(error);
    throw new Error("Bookings could not be loaded");
  }

  return { data, count };
}

export async function getBooking(id) {
  const { data, error } = await supabase
    .from("booking")
    .select("*, cabins(*), guests(*)")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking not found");
  }

  return data;
}

// Returns all BOOKINGS that were created after the given date. Useful to get bookings created in the last 30 days, for example.
// date: ISOString
export async function getBookingsAfterDate(date) {
  const { data, error } = await supabase
    .from("booking")
    .select("created_at, totalPrice, extrasPrice")
    .gte("created_at", date)
    .lte("created_at", getToday({ end: true }));

  if (error) {
    console.error(error);
    throw new Error("Bookings could not be loaded");
  }

  return data;
}

// Returns all STAYS that were created after the given date
export async function getStaysAfterDate(date) {
  if (!(date instanceof Date) && typeof date !== "string") {
    throw new Error("Invalid date format. Please provide a valid date.");
  }

  const { data, error } = await supabase
    .from("booking")
    .select("*, guests!booking_guestId_fkey(fullName)")
    .gte("startDate", date)
    .lte("startDate", getToday());

  console.log("Data:", data);
  console.log("Error:", error);

  if (error) {
    console.error(error);
    throw new Error("Bookings could not be loaded: " + error.message);
  }

  return data;
}

// Activity means that there is a check-in or a check-out today
export async function getStaysTodayActivity() {
  const { data, error } = await supabase
    .from("booking")
    .select(
      "*, guests!booking_guestId_fkey(fullName, nationality, countryFlag)"
    )
    .or(
      `and(status.eq.unconfirmed,startDate.eq.${getToday()}),and(status.eq.checked-in,endDate.eq.${getToday()})`
    )
    .order("created_at");

  if (error) {
    console.error(error);
    throw new Error("Bookings could not be loaded");
  }
  return data;
}

export async function updateBooking(id, obj) {
  const { data, error } = await supabase
    .from("booking")
    .update(obj)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }
  return data;
}

export async function deleteBooking(id) {
  const { data, error } = await supabase.from("booking").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
  return data;
}
