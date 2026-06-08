
const Stories = () => {
  const stories = [
    {
      id: 1,
      name: "Ali",
      text: "Today I learned how to build my first chatbot using AI!",
    },
    {
      id: 2,
      name: "Sara",
      text: "Automation with n8n made my workflow 10x faster.",
    },
    {
      id: 3,
      name: "Daniyal",
      text: "I am building my own AI assistant step by step 🚀",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      
      {/* Header */}
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        User Stories
      </h1>

      {/* Stories Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story) => (
          <div
            key={story.id}
            className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transition"
          >
            <h2 className="text-xl font-semibold text-green-600 mb-2">
              {story.name}
            </h2>
            <p className="text-gray-600">{story.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stories;