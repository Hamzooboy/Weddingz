const mongoose = require("mongoose");
const Venue = require("./venueModel");

const bookingSchema = new mongoose.Schema(
  {
    venue: {
      type: mongoose.Schema.ObjectId,
      ref: "Venues",
      // required: [true, 'Booking must belong to a Venue']
    },
    // vendor: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: "Vendors",
    //   // required: [true, 'Booking must belong to a Vendor']
    // },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
      required: [true, "Booking must belong to a Customer"],
    },
    price: {
      type: Number,
      required: [true, 'A Booking must have a price']
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    status: {
      type: String,
      required: true,
      default: "Booked",
    },
    slot: {
      type: String,
      enum: ["morning", "evening"],
      default: "evening",
      required: [true, "Booking slot is required"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
bookingSchema.pre(/^find/, function (next) {
  this.populate("user").populate({
    path: "venue",
    select: "title",
  });
  next();
});

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
