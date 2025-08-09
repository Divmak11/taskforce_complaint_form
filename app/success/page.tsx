"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl border border-neutral-200 p-10 max-w-lg w-full text-center shadow-sm text-neutral-900">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 10 }}
          className="mx-auto mb-6 h-24 w-24 rounded-full bg-green-100 flex items-center justify-center"
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-12 w-12 text-green-600"
          >
            <motion.path
              d="M20 6L9 17l-5-5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.7, ease: "easeInOut", delay: 0.2 }}
            />
          </motion.svg>
        </motion.div>
        <motion.h1
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="text-2xl font-semibold mb-2"
        >
          Successful Submission
        </motion.h1>
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="text-neutral-700 mb-6"
        >
          Thank you for sharing the details. Your complaint has been recorded.
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white px-5 py-3 hover:bg-blue-700"
          >
            Submit another response
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
