"use client"

import Image from "next/image"
import Link from "next/link"

export default function Reachout() {
    return (
        <>
            {/* Reach Out to Us Now Section */}
            <section className="py-12 px-6 md:px-16 max-w-4xl mx-auto text-center bg-gray-100">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                    Reach Out to Us Now!
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                    Ready to take the next step in your wellness journey? Make an informed decision about your health by connecting with our dedicated team at EUTRIV Health Care.{" "}
                    <Link
                        href="/contact"
                        className="text-blue-600 hover:text-blue-800 underline font-semibold"
                    >
                        Contact us today
                    </Link>{" "}
                    to learn more or schedule a consultation.
                </p>
            </section>

            {/* Get In Touch Section */}
            <section className="py-12 px-6 md:px-16 max-w-4xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 text-center">
                    Get In Touch
                </h2>
                <div className="flex flex-col md:flex-row space-x-0 md:space-x-6 items-center">
                    <div className="relative w-full md:w-1/2 h-64 md:h-96 mb-6 md:mb-0">
                        <Image
                            src="/images/location.jpg"
                            alt="EUTRIV Health Care Location"
                            fill
                            className="object-cover rounded-lg"
                            priority
                        />
                    </div>
                    <div className="w-full md:w-1/2 text-center md:text-left">
                        <p className="text-gray-600 leading-relaxed mb-4">
                            Visit us at EUTRIV Health Care to experience our client-focused care in person. Our team is ready to assist you with your wellness needs.
                        </p>
                        <p className="text-gray-800 font-semibold mb-2">
                            <span className="font-bold">Location:</span> 123 Wellness Avenue, Health City, HC 12345
                        </p>
                        <p className="text-gray-800 font-semibold mb-2">
                            <span className="font-bold">Phone:</span> (555) 123-4567
                        </p>
                        <p className="text-gray-800 font-semibold mb-4">
                            <span className="font-bold">Working Hours:</span> Monday–Friday: 8:00 AM–6:00 PM, Saturday: 9:00 AM–2:00 PM, Sunday: Closed
                        </p>
                        <a
                            href="https://www.google.com/maps?q=123+Wellness+Avenue,+Health+City,+HC+12345"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            View Map and Direction →
                        </a>
                    </div>
                </div>
            </section>
        </>
    )
}