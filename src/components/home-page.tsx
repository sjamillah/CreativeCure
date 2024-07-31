import Link from "next/link";

export function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-green-50">
      <header className="px-4 lg:px-6 h-16 flex items-center bg-white shadow-md">
        <Link href="#" className="flex items-center space-x-2" prefetch={false}>
          <LeafIcon className="h-8 w-8 text-green-600" />
          <span className="sr-only">Creative Cure - Therapists</span>
        </Link>
        <nav className="ml-auto flex space-x-4 sm:space-x-6">
          <Link href="#" className="text-sm font-medium text-green-600 hover:underline" prefetch={false}>
            About
          </Link>
          <Link href="#" className="text-sm font-medium text-green-600 hover:underline" prefetch={false}>
            Therapists
          </Link>
          <Link href="#" className="text-sm font-medium text-green-600 hover:underline" prefetch={false}>
            Contact
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-green-600 via-green-500 to-green-400 relative overflow-hidden">
          <div className="absolute inset-0 bg-white opacity-30 mix-blend-overlay"></div>
          <div className="container mx-auto px-4 md:px-6 grid gap-6 md:grid-cols-2 items-center text-center md:text-left relative z-10">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
                Creative Cure - Therapists
              </h1>
              <p className="text-lg text-white/80">
                Empowering youth through personalized therapy and creative expression. Our mission is to provide a safe and nurturing environment for personal growth and healing.
              </p>
            </div>
            <img
              src="https://www.essence.com/wp-content/uploads/2020/05/GettyImages-501260861-scaled.jpg"
              width="550"
              height="550"
              alt="Hero"
              className="mx-auto rounded-2xl object-cover shadow-lg"
            />
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-green-50">
          <div className="container mx-auto px-4 md:px-6 space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-bold text-green-800 sm:text-4xl md:text-5xl">Meet Our Therapists</h2>
              <p className="max-w-2xl mx-auto text-green-700 md:text-xl">
                Our team of experienced therapists is dedicated to helping youth find their path to healing and personal growth.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {therapists.map((therapist) => (
                <div key={therapist.name} className="bg-white/70 backdrop-blur-lg border border-green-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center">
                    {therapist.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-green-800">{therapist.name}</h3>
                  <p className="text-green-600">{therapist.specialization}</p>
                  <p className="text-center text-green-700">
                    {therapist.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-green-100 p-6 md:py-12 w-full">
        <div className="container max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 text-sm">
          {footerLinks.map((category) => (
            <div key={category.title} className="grid gap-1">
              <h3 className="font-semibold text-green-600">{category.title}</h3>
              {category.links.map((link) => (
                <Link key={link} href="#" className="text-green-700 hover:underline" prefetch={false}>
                  {link}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}

function LeafIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}

const therapists = [
  {
    name: "Jessica Doe",
    specialization: "Child Therapist",
    icon: <LeafIcon className="w-8 h-8 text-green-600" />,
    description: "Jessica is a licensed child therapist with over 10 years of experience helping youth overcome emotional and behavioral challenges."
  },
  {
    name: "Michael Johnson",
    specialization: "Art Therapist",
    icon: <XIcon className="w-8 h-8 text-green-600" />,
    description: "Michael is a skilled art therapist who helps youth express their emotions and work through trauma through creative expression."
  },
  {
    name: "Sarah Anderson",
    specialization: "Family Therapist",
    icon: <LeafIcon className="w-8 h-8 text-green-600" />,
    description: "Sarah is a family therapist who specializes in helping youth and their families navigate complex relationships and communication challenges."
  }
];

const footerLinks = [
  {
    title: "About",
    links: ["Our Mission", "Our Team", "Careers"]
  },
  {
    title: "Services",
    links: ["Individual Therapy", "Family Therapy", "Art Therapy"]
  },
  {
    title: "Resources",
    links: ["Blog", "FAQs", "Testimonials"]
  },
  {
    title: "Contact",
    links: ["Email", "Phone", "Location"]
  },
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms of Service", "Disclaimer"]
  }
];

function XIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
