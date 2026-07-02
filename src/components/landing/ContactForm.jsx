import { useState } from "react";
import { Send } from "lucide-react";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  const submit = (event) => {
    event.preventDefault();
    setSent(true);
    event.currentTarget.reset();
  };

  return (
    <form onSubmit={submit} className="rounded-[8px] border border-line bg-white p-6 shadow-soft">
      <div className="grid gap-4 sm:grid-cols-2">
        {["Name", "Email", "Company/Institute", "Phone"].map((label) => (
          <label key={label} className="text-sm font-bold text-ink">
            {label}
            <input
              required={label !== "Phone"}
              type={label === "Email" ? "email" : "text"}
              className="mt-2 w-full rounded-[8px] border border-line bg-cloud px-4 py-3 text-sm outline-none focus:border-pine"
            />
          </label>
        ))}
      </div>
      <label className="mt-4 block text-sm font-bold text-ink">
        Message
        <textarea required rows="5" className="mt-2 w-full resize-none rounded-[8px] border border-line bg-cloud px-4 py-3 text-sm outline-none focus:border-pine" />
      </label>
      <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-bold text-white hover:bg-pine sm:w-auto">
        <Send className="h-4 w-4" /> Submit request
      </button>
      {sent && <p className="mt-4 rounded-[8px] bg-mint px-4 py-3 text-sm font-bold text-pine">Thanks. Your demo enquiry has been received.</p>}
    </form>
  );
}
