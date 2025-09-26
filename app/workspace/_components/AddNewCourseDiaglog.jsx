import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

function AddNewCourseDiaglog({ children }) {
  // Normalize children and pick the first valid React element so Radix's
  // DialogTrigger (when used with `asChild`) always receives exactly one
  // element. This avoids errors caused by surrounding whitespace/text nodes.
  const childElement = React.Children.toArray(children).find((c) =>
    React.isValidElement(c)
  )

  return (
    <Dialog>
      {childElement ? (
        <DialogTrigger asChild>{childElement}</DialogTrigger>
      ) : (
        // Fallback trigger if no valid child was provided
        <DialogTrigger>
          <button className="inline-flex items-center rounded-md px-3 py-2">
            Open
          </button>
        </DialogTrigger>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default AddNewCourseDiaglog