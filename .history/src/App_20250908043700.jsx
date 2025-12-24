export default function App() {
    return (
        // CHANGED: The main background is now black to support the dark theme of the lower sections.
        <div className="bg-black font-sans text-white overflow-x-hidden">

            {/* --- GRADIENT SECTION START --- */}
            {/* This div now contains the gradient and wraps only the header and main hero content. */}
            <div className="relative isolate bg-gradient-to-b from-[#1C102E] to-black">
                {/* Background Gradient decorative element */}
                <div className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
                    <div
                        className="relative left-[calc(50%)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[190deg] bg-gradient-to-tr from-[#EC1091] to-[#0271E3] opacity-90 sm:left-[calc(50%)] sm:w-[72.1875rem]"
                        style={{
                            clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        }}
                    />
                </div>

                <header className="absolute inset-x-0 top-0 z-50">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <nav className="flex items-center justify-between py-6 max-w-7xl mx-auto" aria-label="Global">
                            <div className="flex lg:flex-1">
                                <a href="#" className="-m-1.5 p-1.5">
                                    <PaperjetLogo />
                                </a>
                            </div>
                            <div className="hidden lg:flex lg:gap-x-12">
                                <a href="#" className="text-sm font-semibold leading-6 text-gray-300 hover:text-white">Product</a>
                                <a href="#" className="text-sm font-semibold leading-6 text-gray-300 hover:text-white">Pricing</a>
                                <a href="#" className="text-sm font-semibold leading-6 text-gray-300 hover:text-white">Company</a>
                                <a href="#" className="text-sm font-semibold leading-6 text-gray-300 hover:text-white">Blog</a>
                            </div>
                            <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4 items-center">
                                <a href="#" className="text-sm font-semibold leading-6 text-gray-300 hover:text-white">Sign in</a>
                                <a href="#" className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Sign up</a>
                            </div>
                        </nav>
                    </div>
                </header>

                <main className="relative pt-24 sm:pt-32">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="max-w-7xl mx-auto text-center">
                            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">Revolutionize your digital signage
                                with real-time updates
                                based on audience insights
                                and engagement metrics.</h1>
                            <div className="mt-10 flex items-center justify-center gap-x-6">
                                <a href="#" className="rounded-md bg-white px-4 py-3 text-sm uppercase color-black font-semibold text-gray-900 shadow-sm hover:bg-gray-200">Book a Demo</a>
                            </div>
                        </div>
                        <div className="mt-16 flow-root sm:mt-24">
                            <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                                <img src="https://i.postimg.cc/TwdJ6TT9/Feature1-UI.png" alt="App screenshot" className="rounded-md shadow-2xl ring-1 ring-gray-900/10 w-full" />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            {/* --- GRADIENT SECTION END --- */}


            {/* Stats section */}
            {/* This section and all others below will now have the black background from the main wrapper */}
            <div className="mt-20">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-x-8 gap-y-10 text-center lg:grid-cols-3 max-w-7xl mx-auto">
                        <div>
                            <h3 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">1M+</h3>
                            <p className="mt-2 text-base leading-7 text-gray-400">Audience Interests</p>
                        </div>
                        <div>
                            <h3 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">5K+</h3>
                            <p className="mt-2 text-base leading-7 text-gray-400">Trusted companies</p>
                        </div>
                        <div>
                            <h3 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">200+</h3>
                            <p className="mt-2 text-base leading-7 text-gray-400">Trusted partners</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Logos section */}
            <div className="mt-20">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <p className="text-center text-sm font-semibold text-gray-400">Trusted by 25,000+ companies</p>
                        <div className="mt-10 grid grid-cols-2 items-center gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
                            <span className="col-span-1 text-2xl font-bold text-gray-300 text-center">Zebra</span>
                            <span className="col-span-1 text-2xl font-bold text-gray-300 text-center">Mondaze</span>
                            <span className="col-span-1 text-2xl font-bold text-gray-300 text-center">Hexlant</span>
                            <span className="col-span-1 text-2xl font-bold text-gray-300 text-center">AIMMO</span>
                            <span className="col-span-1 text-2xl font-bold text-gray-300 text-center">SELECT</span>
                            <span className="col-span-1 text-2xl font-bold text-gray-300 text-center">Company</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Video Section */}
            <div className="mt-20">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="relative aspect-video rounded-xl shadow-2xl overflow-hidden">
                            <img src="https://placehold.co/1024x576/18181B/FFF?text=Video+Thumbnail" alt="Video Thumbnail" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                <button className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white border-opacity-30 transition-transform hover:scale-110">
                                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M6.3 3.75a.75.75 0 011.05 0l7.5 6.25a.75.75 0 010 1.05l-7.5 6.25a.75.75 0 01-1.05-1.05L13.2 10 6.3 4.8a.75.75 0 010-1.05z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="mt-20">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 max-w-7xl mx-auto">
                        <div className="bg-white/5 rounded-2xl p-8 shadow-xl">
                            <h3 className="text-xl font-semibold">Signage Connection</h3>
                            <p className="mt-2 text-gray-400">Onboard new screens in minutes, with fully-online, template creation for any display and resolution.</p>
                            <div className="mt-6 -m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-white/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                                <img src="https://i.postimg.cc/TwdJ6TT9/Feature1-UI.png" alt="Feature 1" className="rounded-md w-full" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-white/5 rounded-2xl p-8 shadow-xl">
                                <h3 className="text-xl font-semibold">Multiplayer with CV</h3>
                                <p className="mt-2 text-gray-400">Track and engage with audiences as they move through your stores and spaces.</p>
                                <div className="mt-6 -m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-white/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                                    <img src="https://i.postimg.cc/3RsTbrML/feature2.png" alt="Feature 2" className="rounded-md w-full" />
                                </div>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-8 shadow-xl">
                                <h3 className="text-xl font-semibold">Lightning fast</h3>
                                <p className="mt-2 text-gray-400">Update content and playlists on one, or thousands of screens in an instant.</p>
                                <div className="mt-6 -m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-white/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                                    <img src="https://i.postimg.cc/KvybPYDj/feature3.png" alt="Feature 3" className="rounded-md w-full object-cover aspect-[4/5]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pricing Section */}
            <div className="py-24 sm:py-32">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center">
                            <span className="bg-white/10 text-white text-xs font-medium px-2.5 py-1 rounded-full">PRICING</span>
                            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">The right price for you, whoever you are</h2>
                            <p className="mt-6 text-lg leading-8 text-gray-300">
                                Choose a plan that works for you.
                            </p>
                        </div>
                        <div className="mt-16 grid grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:grid-cols-3">
                            {/* Plan 1 */}
                            <div className="relative bg-white/5 p-8 rounded-3xl shadow-xl ring-2 ring-indigo-500">
                                <h3 className="text-base font-semibold leading-7 text-indigo-400">Professional</h3>
                                <p className="mt-4 flex items-baseline gap-x-2">
                                    <span className="text-5xl font-bold tracking-tight text-white">$99</span>
                                    <span className="text-base text-gray-400">/month</span>
                                </p>
                                <p className="mt-6 text-base leading-7 text-gray-300">For small teams and startups.</p>
                                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-300">
                                    <li className="flex gap-x-3"><CheckCircle className="h-6 w-5 flex-none text-indigo-400" /> 10 users</li>
                                    <li className="flex gap-x-3"><CheckCircle className="h-6 w-5 flex-none text-indigo-400" /> Basic analytics</li>
                                    <li className="flex gap-x-3"><CheckCircle className="h-6 w-5 flex-none text-indigo-400" /> 24/7 support</li>
                                </ul>
                                <a href="#" className="mt-8 block rounded-md bg-indigo-500 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                                    Choose plan
                                </a>
                            </div>

                            {/* Plan 2 */}
                            <div className="relative bg-white/5 p-8 sm:mx-8 lg:mx-0 rounded-3xl shadow-xl ring-1 ring-white/10">
                                <h3 className="text-base font-semibold leading-7 text-gray-300">Business</h3>
                                <p className="mt-4 flex items-baseline gap-x-2">
                                    <span className="text-5xl font-bold tracking-tight text-white">$123</span>
                                    <span className="text-base text-gray-400">/month</span>
                                </p>
                                <p className="mt-6 text-base leading-7 text-gray-300">For growing businesses.</p>
                                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-300">
                                    <li className="flex gap-x-3"><CheckCircle className="h-6 w-5 flex-none text-gray-400" /> 50 users</li>
                                    <li className="flex gap-x-3"><CheckCircle className="h-6 w-5 flex-none text-gray-400" /> Advanced analytics</li>
                                    <li className="flex gap-x-3"><CheckCircle className="h-6 w-5 flex-none text-gray-400" /> Priority support</li>
                                </ul>
                                <a href="#" className="mt-8 block rounded-md border border-white/20 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-white/10">
                                    Choose plan
                                </a>
                            </div>

                            {/* Plan 3 */}
                            <div className="relative bg-white/5 p-8 rounded-3xl shadow-xl ring-1 ring-white/10">
                                <h3 className="text-base font-semibold leading-7 text-gray-300">Enterprise</h3>
                                <p className="mt-4 flex items-baseline gap-x-2">
                                    <span className="text-5xl font-bold tracking-tight text-white">$252</span>
                                    <span className="text-base text-gray-400">/month</span>
                                </p>
                                <p className="mt-6 text-base leading-7 text-gray-300">For large enterprises.</p>
                                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-300">
                                    <li className="flex gap-x-3"><CheckCircle className="h-6 w-5 flex-none text-gray-400" /> Unlimited users</li>
                                    <li className="flex gap-x-3"><CheckCircle className="h-6 w-5 flex-none text-gray-400" /> Custom integrations</li>
                                    <li className="flex gap-x-3"><CheckCircle className="h-6 w-5 flex-none text-gray-400" /> Dedicated support</li>
                                </ul>
                                <a href="#" className="mt-8 block rounded-md border border-white/20 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-white/10">
                                    Choose plan
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Community Section */}
            <div className="text-center py-16">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-center items-center mb-6">
                            <div className="inline-flex items-center justify-center space-x-3 bg-gray-900/40 p-3 rounded-3xl shadow-lg ring-1 ring-white/10">
                                <CommunityIconMail />
                                <CommunityIconFile />
                                <CommunityIconServer />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Join the community</h2>
                        <p className="mt-4 text-lg leading-8 text-gray-300">Join our 1,000,000+ person community and contribute to a more private, Signage-first technology.</p>
                        <div className="mt-8">
                            <a href="#" className="inline-flex items-center gap-x-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-200">
                                Join Now
                                <ArrowRight className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-[#160C25]">
                <div className="py-12">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="max-w-7xl mx-auto">
                            <div className="flex items-center justify-center space-x-6">
                                <a href="#"><TwitterIcon /></a>
                                <a href="#"><DiscordIcon /></a>
                                <a href="#"><GithubIcon /></a>
                                <a href="#"><SlackIcon /></a>
                                <a href="#"><YouTubeIcon /></a>
                            </div>
                            <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4">
                                <div className="md:col-start-2">
                                    <h3 className="text-sm font-semibold leading-6 text-white">PRODUCTS</h3>
                                    <ul role="list" className="mt-6 space-y-4">
                                        <li><a href="#" className="text-sm leading-6 text-gray-300 hover:text-white">Mail</a></li>
                                        <li><a href="#" className="text-sm leading-6 text-gray-300 hover:text-white">Drive</a></li>
                                        <li><a href="#" className="text-sm leading-6 text-gray-300 hover:text-white">Chat</a></li>
                                        <li><a href="#" className="text-sm leading-6 text-gray-300 hover:text-white">Calendar</a></li>
                                        <li><a href="#" className="text-sm leading-6 text-gray-300 hover:text-white">Photos</a></li>
                                        <li><a href="#" className="text-sm leading-6 text-gray-300 hover:text-white">Download</a></li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold leading-6 text-white">RESOURCES</h3>
                                    <ul role="list" className="mt-6 space-y-4">
                                        <li><a href="#" className="text-sm leading-6 text-gray-300 hover:text-white">Blog</a></li>
                                        <li><a href="#" className="text-sm leading-6 text-gray-300 hover:text-white">Help</a></li>
                                        <li><a href="#" className="text-sm leading-6 text-gray-300 hover:text-white">About us</a></li>
                                        <li><a href="#" className="text-sm leading-6 text-gray-300 hover:text-white">Changelog</a></li>
                                    </ul>
                                </div>
                            </div>
                            <p className="mt-10 text-center text-xs leading-5 text-gray-400">&copy; 2025 Your Company, Inc. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}