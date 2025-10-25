"use client"

import Image from "next/image"
import Form from "./Form"

export default function Contact() {
    return (
        <div className="w-full bg-white">
            {/* Hero Section */}
            <section className="relative h-[100vh] w-full">
                <Image
                    src="/images/contact-hero.jpg"
                    alt="Contact Us at Pleasant Home Care"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <h1 className="text-3xl text-center sm:text-5xl font-bold text-white drop-shadow-lg">
                        Fill the Form Below to Contact Us
                    </h1>
                </div>
            </section>
            <section className="py-12 px-6 md:px-16 max-w-4xl mx-auto text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                    Set an appointment with the Pleasant Home Care Team
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                    Do you have a question? Pleasant Home Care is here to assist you. Inquire about our home care agency by
                    sending us a message through the form below, and we’ll get back to you promptly.
                </p>
            </section>
            <Form title="Set An Appointment" style={{ marginTop: "-60px" }} />
        </div>
    )
}