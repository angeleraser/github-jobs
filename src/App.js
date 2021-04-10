/* eslint-disable no-unused-vars */
import { useState } from "react";
import "./App.css";
import githubLogo from "./github-logo";

const fetchJobsByQueries = (
  { search, location, remote, fullTime },
  setJobsData,
  setFetchStatus
) => {
  let searchQuery = search;

  if (remote) {
    search = `${searchQuery}+remote`;
  }

  let url = `https://jobs.github.com/positions.json?search=${encodeURI(
    searchQuery
  )}&location=${encodeURI(location)}`;

  if (fullTime) {
    url = `${url}&full_time=on`;
  }

  // GitHub jobs API does not allow the requests from the client, so must use this
  url = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;

  // Clean the current jobs data
  setJobsData([]);

  setFetchStatus("Browsing jobs...");

  // Fetch to the api...
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((jobsData) => {
      const fetchedData = JSON.parse(jobsData.contents);

      if (fetchedData.length === 0) {
        return setFetchStatus("No jobs found");
      }

      setJobsData(fetchedData);

      setFetchStatus(
        "Browse your favourite jobs by type a description, location, full time or remote"
      );
    })
    .catch(() =>
      setFetchStatus("Oops, an error has ocurred, please try to search again.")
    );
};

function App() {
  const [jobsData, setJobsData] = useState([]);

  const [fetchStatus, setFetchStatus] = useState(
    "Browse your favourite jobs by type a description, location, full time or remote"
  );

  const [formData, setFormData] = useState({
    search: "",
    location: "",
    fullTime: false,
    remote: false,
  });

  const handleSearchJobs = (e) => {
    e.preventDefault();

    fetchJobsByQueries(formData, setJobsData, setFetchStatus);

    // Reset the form data
    setFormData({
      search: "",
      location: "",
      fullTime: false,
      remote: false,
    });
  };

  const handleInputChange = ({ target: { name, value, type, checked } }) => {
    if (type === "checkbox") {
      return setFormData((prev) => ({ ...prev, [`${name}`]: checked }));
    }

    setFormData((prev) => ({ ...prev, [`${name}`]: value }));
  };

  return (
    <div className="app wrapper">
      {/* App Header */}
      <header className="app-header">
        {/* Github logo & app name*/}
        <div className="name-logo">
          {githubLogo}
          <h1>Github Jobs</h1>
        </div>
        <p>
          Search for jobs by term, location full time vs part time, or any
          combination of the three. <br /> All parameters are optional.
        </p>
      </header>

      {/* App Main */}
      <main className="app-main">
        {/* Filter section */}
        <section className="filters-section">
          <h2 className="section-heading">Filters</h2>

          <form onSubmit={handleSearchJobs} className="search-form">
            <label htmlFor="search">
              <h3>By description:</h3>

              <input
                onChange={handleInputChange}
                type="text"
                name="search"
                id="search"
                value={formData.search}
                placeholder="Title, companies, technology"
              />
            </label>

            <label htmlFor="location">
              <h3>By location:</h3>

              <input
                onChange={handleInputChange}
                type="text"
                value={formData.location}
                name="location"
                id="location"
                placeholder="Location, country, state, city"
              />
            </label>

            <label className="checkbox-label" htmlFor="full-time">
              <input
                onChange={handleInputChange}
                value="on"
                checked={formData.fullTime}
                type="checkbox"
                name="fullTime"
                id="full-time"
              />
              <span>Full time</span>
            </label>

            <label className="checkbox-label" htmlFor="remote">
              <input
                onChange={handleInputChange}
                value="on"
                checked={formData.remote}
                type="checkbox"
                name="remote"
                id="remote"
              />
              <span>Remote</span>
            </label>

            <button className="submit-button" type="submit">
              Search
            </button>
          </form>
        </section>

        {/* Results section */}
        <section className="results-section">
          <h2 className="section-heading">Results</h2>
          <div className="cards-container">
            {jobsData.length === 0 && (
              <div className="status-message">{fetchStatus}</div>
            )}
            {jobsData.map((job) => (
              <article key={job.id} className="job-card">
                <div className="company-logo">
                  {job.company_logo ? (
                    <img src={job.company_logo} alt={job.company} />
                  ) : (
                    job.company[0]
                  )}
                </div>
                <ul className="info">
                  <li className="company-name">{job.company}</li>
                  <li className="ocupation">{job.title}</li>
                  <li className="info-item">{job.location}</li>
                  <li className="info-item job-type">{job.type}</li>
                </ul>
              </article>
            ))}
          </div>
        </section>
      </main>

      {/* App Footer */}
      <footer className="app-footer">
        <a
          href="https://junocollege.com/"
          rel="nooppener noreferrer"
          target="_blank">
          Copyright © Juno College
        </a>
      </footer>
    </div>
  );
}

export default App;
