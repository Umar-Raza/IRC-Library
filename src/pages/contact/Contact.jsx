import React from 'react';
import { Mail, MessageCircle, Phone, MapPin } from 'lucide-react';

export const Contact = () => {
    const contactDetails = [
        {
            id: 1,
            title: "Email",
            value: "Islamic Research Center",
            icon: <Mail className="text-neutral" size={32} />,
            link: "mailto:almadinatulilmia.fsd@dawateislami.net",
            color: "hover:border-neutral text-neutral"
        },
        {
            id: 2,
            title: "Whatsapp",
            value: "+923108882033",
            icon: <MessageCircle className="text-neutral" size={32} />,
            link: "https://wa.me/923108882033",
            color: "hover:border-neutral text-neutral"
        },
        {
            id: 3,
            title: "Phone",
            value: "+923108882033",
            icon: <Phone className="text-neutral" size={32} />,
            link: "tel:+923108882033",
            color: "hover:border-neutral text-neutral"
        },
        {
            id: 4,
            title: "Location",
            value: "Faisalabad, Punjab, Pakistan",
            icon: <MapPin className="text-neutral" size={32} />,
            link: "https://www.google.com/maps/search/213+Susan+Road,+Madina+Town,+Faizan+e+Madina,+Attar+Tower+4th+Floor,+Islamic+Research+Center,+Faisalabad,+Pakistan/@31.4223,73.1189,934m/data=!3m1!1e3?hl=en&entry=ttu&g_ep=EgoyMDI2MDIyMy4wIKXMDSoASAFQAw%3D%3D",
            color: "hover:border-neutral text-neutral"
        }
    ];

    return (
        <div className="py-10 px-4">
            <h2 className="text-2xl font-bold text-center mb-8 text-neutral underline">Contact</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {contactDetails.map((item) => (
                    <a
                        key={item.id}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex flex-col items-center p-6 bg-base-100 border-2 border-base-300 rounded-2xl shadow-sm transition-all duration-300 transform hover:-translate-y-2 ${item.color} cursor-pointer`}
                    >
                        <div className="mb-4 bg-base-200 p-4 rounded-full">
                            {item.icon}
                        </div>
                        <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                        <p className="text-sm text-center text-base-content/70 break-all">
                            {item.value}
                        </p>
                    </a>
                ))}
            </div>
        </div>
    );
};
