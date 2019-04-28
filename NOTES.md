# Implementation Notes

First step is to make the markup more semantic via main, section and button
elements. Headings start with h1 and descend from there. Sizing of headers can
be handled by css.

Next step is to tackle the calculation of the available slots. This is currently
done in the render so we are recomputing the slots on each render. This is
unnecessary.

The post request details in the README don't mention setting the appointment
type (i.e audio or video) but it is in the json. I've chosen not to submit it
but it would be simple to add.

I've hardcoded lists of the consultant types and appointment types. In the real
world these values may come from a separate API call. Further, the mock-up seems
to show a description "Babylon GP" for the selected consultant type. I've
hard-coded this for convenience but again this may come from the data.

There are no assets for the icons and fonts so I've just used a basic sans-serif
font and icons from react-icons library.

# Possible improvements

I've not added any affordance that a request is running (for the user profile,
appointment booking and fetching appointments). In a production version I would
implement a higher order component to manage the different states and in
particular distinguish between the states of no transactions have been run /
transaction is running and transaction returned with no data.

The error handling is basic. It presents an error to the screen and logs to the
console. In a real implementation I'd expect to properly log the error for
reporting and follow-up.
