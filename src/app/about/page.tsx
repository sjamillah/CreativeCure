import Link from "next/link";

export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-green-50">
      <header className="px-4 lg:px-6 h-16 flex items-center bg-white shadow-md">
        <Link href="/" className="flex items-center space-x-2" prefetch={false}>
          <LeafIcon className="h-8 w-8 text-green-600" />
          <span className="sr-only">Creative Cure - Therapists</span>
        </Link>
        <nav className="ml-auto flex space-x-4 sm:space-x-6">
          <Link href="/" className="text-sm font-medium text-green-600 hover:underline" prefetch={false}>
            Home
          </Link>
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

      <main className="flex-1 py-12 md:py-24 lg:py-32 bg-green-50">
        <div className="container mx-auto px-4 md:px-6 space-y-12">
          <section className="text-center">
            <h1 className="text-4xl font-bold text-green-800 sm:text-5xl md:text-6xl">About Us</h1>
            <p className="text-lg text-green-700 mt-4 max-w-2xl mx-auto">
              At Creative Cure, we are committed to empowering youth through personalized therapy and creative expression.
              Our mission is to provide a safe and nurturing environment for personal growth and healing.
            </p>
          </section>

          <section className="text-center">
            <h2 className="text-3xl font-bold text-green-800 sm:text-4xl md:text-5xl">Our Vision</h2>
            <p className="text-lg text-green-700 mt-4 max-w-2xl mx-auto">
              We envision a world where every young person has access to the support and resources they need to thrive, emotionally and creatively.
            </p>
          </section>

          <section className="text-center">
            <h2 className="text-3xl font-bold text-green-800 sm:text-4xl md:text-5xl">Our Values</h2>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold text-green-700">Compassion</h3>
                <p className="text-green-600 mt-2">
                  We approach each individual with kindness and understanding, fostering a supportive and caring environment.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold text-green-700">Integrity</h3>
                <p className="text-green-600 mt-2">
                  We are committed to honesty and transparency in all our interactions, ensuring trust and respect.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold text-green-700">Creativity</h3>
                <p className="text-green-600 mt-2">
                  We believe in the power of creative expression as a tool for healing and personal growth.
                </p>
              </div>
            </div>
          </section>

          <section className="text-center">
            <h2 className="text-3xl font-bold text-green-800 sm:text-4xl md:text-5xl">Our Team</h2>
            <p className="text-lg text-green-700 mt-4 max-w-2xl mx-auto">
              Our team of dedicated therapists is passionate about supporting youth in their journey towards healing and growth.
            </p>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {teamMembers.map((member) => (
                <div key={member.name} className="bg-white/70 backdrop-blur-lg border border-green-200 rounded-lg shadow-lg p-6 flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center">
                    {member.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-green-800">{member.name}</h3>
                  <p className="text-green-600">{member.role}</p>
                  <p className="text-center text-green-700">{member.bio}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="text-center">
            <h2 className="text-3xl font-bold text-green-800 sm:text-4xl md:text-5xl">Join Us</h2>
            <p className="text-lg text-green-700 mt-4 max-w-2xl mx-auto">
              Interested in joining our team or learning more about our programs? Contact us to find out how you can get involved.
            </p>
            <Link href="/contact" className="mt-6 inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700">
              Get in Touch
            </Link>
          </section>
        </div>
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

const teamMembers = [
  {
    name: "Jessica Doe",
    role: "Child Therapist",
    icon: <LeafIcon className="w-8 h-8 text-green-600" />,
    bio: "Jessica is a licensed child therapist with over 10 years of experience helping youth overcome emotional and behavioral challenges."
  },
  {
    name: "Michael Johnson",
    role: "Art Therapist",
    icon: <XIcon className="w-8 h-8 text-green-600" />,
    bio: "Michael is a skilled art therapist who helps youth express their emotions and work through trauma through creative expression."
  },
  {
    name: "Sarah Anderson",
    role: "Family Therapist",
    icon: <LeafIcon className="w-8 h-8 text-green-600" />,
    bio: "Sarah is a family therapist who specializes in helping youth and their families navigate complex relationships and communication challenges."
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
