import React, { useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

const Dashboard: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [body, setBody] = useState("");
  const [recipients, setRecipients] = useState("");
  const [category, setCategory] = useState("");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Qui puoi gestire l'invio del form e fare le operazioni necessarie con i dati inseriti
    // ad esempio, puoi inviare una richiesta API per creare una nuova "squeal"
    console.log(body, recipients, category);
    // Resetta i campi del form
    setBody("");
    setRecipients("");
    setCategory("");
    // Nascondi il form
    setShowForm(false);
  };

  const handleCreateNewSquealClick = () => {
    setShowForm(!showForm);
    setBody("");
    setRecipients("");
    setCategory("");
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div
      className={`container mx-auto px-4 sm:px-6 lg:px-8 ${
        darkMode ? "bg-orange" : "bg-orange"
      } rounded-lg`}
    >
      <nav className="flex items-center justify-between py-4 ">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
        <div>
          <button
            className="p-4 py-2 rounded-lg bg-grey text-white"
            onClick={toggleDarkMode}
          >
            {darkMode ? <FiSun /> : <FiMoon />}
            {/* <span className="ml-2">
              {darkMode ? "Light Mode" : "Dark Mode"}
            </span> */}
          </button>
        </div>
      </nav>

      <div
        className={`py-4 rounded-lg ${darkMode ? "bg-orange" : "bg-orange"}`}
      >
        <ul className="flex flex-wrap justify-center space-x-2 sm:justify-center sm:space-x-4">
          <li>
            <button
              className="btn-link bg-grey text-white rounded-lg p-4 m-2 w-[200px] "
              onClick={handleCreateNewSquealClick}
            >
              Create New Squeal
            </button>
            {showForm && (
              <form className="mt-4" onSubmit={handleFormSubmit}>
                <div className="mb-4">
                  <label htmlFor="body" className="block mb-2 font-bold">
                    Body
                  </label>
                  <textarea
                    id="body"
                    className="w-full px-3 py-2 border rounded"
                    rows={4}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label htmlFor="recipients" className="block mb-2 font-bold">
                    Recipients
                  </label>
                  <input
                    type="text"
                    id="recipients"
                    className="w-full px-3 py-2 border rounded"
                    value={recipients}
                    onChange={(e) => setRecipients(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="category" className="block mb-2 font-bold">
                    Category
                  </label>
                  <input
                    type="text"
                    id="category"
                    className="w-full px-3 py-2 border rounded"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn-orange bg-grey text-white px-4 py-2 rounded"
                >
                  Submit
                </button>
              </form>
            )}
          </li>
          <li>
            <button className="btn-link bg-grey text-white rounded-lg p-4 m-2 w-[200px]">
              Analytics
            </button>
          </li>
          <li>
            <button className="btn-link bg-grey text-white rounded-lg p-4 m-2 w-[200px]">
              Geolocation
            </button>
          </li>
          <li>
            <button className="btn-link bg-grey text-white rounded-lg p-4 m-2 w-[200px]">
              Buy More Character
            </button>
          </li>
          <li>
            <button className="btn-link bg-grey text-white rounded-lg p-4 m-2 w-[200px]">
              Add/Remove SMM
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
