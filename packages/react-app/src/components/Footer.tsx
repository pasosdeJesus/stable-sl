"use client"

export default function Footer() {

  return (
    <div className="px-5 sm:px-8 py-4 bg-offwhite300 text-center text-black text-sm opacity-60 rounded-md dark:bg-surface-800 dark:text-surface-100 mt-4">
      <p className="text-xs">For any queries, send us an email at</p>
      <p className="underline underline-offset-5 opacity-100 text-onrampSecondary">
        <a href="mailto:support@onramp.money?subject=Support ticket for tx">support@onramp.money</a>
      </p>
    </div>
  )
}
