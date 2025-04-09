import React from 'react';
import { Mail, Github, Twitter, MessagesSquare } from 'lucide-react';

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a
        href={href}
        className="hidden sm:flex px-4 py-2 transition-all duration-300 ease-out
                 border rounded-full border-black/80 text-black/80
                 hover:border-black hover:text-black
                 hover:scale-105 transform"
    >
        {children}
    </a>
);

const IconLink = ({ href, icon: Icon }: { href: string; icon: React.ElementType }) => (
    <a
        href={href}
        className="sm:hidden p-3 transition-all duration-300 ease-out
                 border rounded-full border-black/80 text-black/80
                 hover:border-black hover:text-black
                 hover:scale-110 transform"
    >
        <Icon size={20} />
    </a>
);

const Footer = () => {
    return (
        <footer className="w-full min-h-screen bg-gradient-to-r from-blue-400 to-cyan-300 
                        flex flex-col justify-between p-4 sm:p-8">
            {/* Logo Section */}
            <div className="container mx-auto pt-12 sm:pt-20 pb-16 sm:pb-32 flex justify-center sm:justify-start">
                <h1 className="text-5xl sm:text-7xl md:text-9xl 
                           font-normal text-gray-800 tracking-tight leading-none
                           transition-all duration-300">
                    ReviveAI
                </h1>
            </div>

            {/* Bottom Section */}
            <div className="container mx-auto flex flex-col gap-8 text-gray-800">
                {/* Location and Copyright */}
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 
                            text-sm sm:text-base text-gray-800/80">
                    <span>San Francisco, USA</span>
                    <span className="hidden sm:block">•</span>
                    <span>© 2024 Comfy Org</span>
                </div>

                {/* Desktop Links */}
                <div className="hidden sm:flex flex-wrap gap-3 
                            justify-start pb-8">
                    <FooterLink href="mailto:hello@comfy.org">
                        hello@comfy.org
                    </FooterLink>
                    <FooterLink href="/discord">
                        Discord
                    </FooterLink>
                    <FooterLink href="/twitter">
                        Twitter
                    </FooterLink>
                    <FooterLink href="/reddit">
                        Reddit
                    </FooterLink>
                    <FooterLink href="/github">
                        Github
                    </FooterLink>
                </div>

                {/* Mobile Icons */}
                <div className="sm:hidden flex justify-center gap-4 pb-8">
                    <IconLink
                        href="mailto:hello@comfy.org"
                        icon={Mail}
                    />
                    <IconLink
                        href="/discord"
                        icon={MessagesSquare}
                    />
                    <IconLink
                        href="/twitter"
                        icon={Twitter}
                    />
                    {/* <IconLink
                        href="/reddit"
                        icon={BrandReddit}
                    /> */}
                    <IconLink
                        href="/github"
                        icon={Github}
                    />
                </div>
            </div>
        </footer>
    );
};

export default Footer;