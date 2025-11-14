import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        {
            href: 'https://github.com',
            'aria-label': 'GitHub Profile',
            icon: <Github size={24} />,
        },
        {
            href: 'https://linkedin.com',
            'aria-label': 'LinkedIn Profile',
            icon: <Linkedin size={24} />,
        },
        {
            href: 'mailto:contact@fueltracker.com',
            'aria-label': 'Send an Email',
            icon: <Mail size={24} />,
        },
    ];

    return (
        <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-slate-500 dark:text-slate-400">
                <div className="flex justify-center items-center space-x-6 mb-4">
                    {socialLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={link['aria-label']}
                            className="text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-cyan-400 transition-colors duration-300"
                        >
                            {link.icon}
                        </a>
                    ))}
                </div>
                <p className="text-sm">
                    &copy; {currentYear} Fuel Tracker. Todos os direitos reservados.
                </p>
            </div>
        </footer>
    );
};
