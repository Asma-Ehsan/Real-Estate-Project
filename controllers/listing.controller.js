import Listing from "../models/listing.models.js";
import errorHandler from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(401, "You can only delete your own listing"));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only delete your own listing"));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Listing deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, "Listing not found"));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only update your own listing"));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: "after" }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    // Get limit from query string, convert it to a number, or use 9 as the default limit
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    let offer = req.query.offer;
    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] }; //Find listings where offer is: false OR true
    }

    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] }; //Find listings where furnished is: false OR true
    }

    let parking = req.query.parking;
    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] }; //Find listings where parking is: false OR true
    }

    let type = req.query.type;
    if (type === undefined || type === "all") {
      type = { $in: ["rent", "sale"] }; //Find listings where type is: rent OR sale
    }

    const search = req.query.searchTerm || "";
    const sort = req.query.sort || "createdAt"; //sorted by latest by default
    const order = req.query.order || "desc";

    // Query database with filters, search, sorting, and pagination
    const listings = await Listing.find({
      //  Search by name using:
      //  $regex: “match pattern instead of exact text”$options: 'i': case-insensitive search
      name: { $regex: search, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort(
        { [sort]: order } // Sort results dynamically based on query params. [sort] uses dynamic property name (computed key), meaning the value inside "sort" (like "price" or "createdAt") becomes the actual field used for sorting instead of a fixed key
      )
      .limit(limit)
      .skip(startIndex); // Limit number of results returned and Skip records for pagination

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
