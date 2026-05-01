const testimonials = [
  {
    name: "Rahul Sharma",
    text: "This system improved complaint resolution speed significantly!",
  },
  {
    name: "Anjali Verma",
    text: "Very intuitive and easy to use. Highly recommended.",
  },
  {
    name: "Faculty Member",
    text: "Efficient tracking and escalation system.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-gray-50 text-center">
      <h2 className="text-3xl font-bold mb-10">What Users Say</h2>

      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 px-6">
        {testimonials.map((t, i) => (
          <div key={i} className="p-6 bg-white rounded-xl shadow">
            <p className="text-gray-600">"{t.text}"</p>
            <h4 className="mt-4 font-semibold">{t.name}</h4>
          </div>
        ))}
      </div>
    </section>
  );
}