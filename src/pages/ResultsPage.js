import React, { useEffect, useState } from "react";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { db } from "../firebase";
import LineChart from "../components/LineChart";
import { entries } from "./testEntries"
import { getAuth, setPersistence, browserLocalPersistence, onAuthStateChanged } from "firebase/auth";
import "../styles/ResultsPage.css";
import ReactLoading from 'react-loading';
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

function ResultsPage({ user, setUser }) {
  const navigate = useNavigate();
  const [weekSurveyData, setWeekSurveyData] = useState(null);
  const [monthSurveyData, setMonthSurveyData] = useState(null);
  const [weekChartTitle, setWeekChartTitle] = useState("");
  const [monthChartTitle, setMonthChartTitle] = useState("");
  const [loading, setLoading] = useState(true);

  async function fetchAllSubmissions(userId) {
    try {
      const entriesRef = collection(db, "surveyResponses", userId, "entries");
      const querySnapshot = await getDocs(entriesRef);
  
      const allEntries = querySnapshot.docs.map((doc) => ({
        ...doc.data(), // All stored fields
      }));
      return allEntries;

    } catch (error) {
      console.error("Error fetching submissions:", error);
      return [];
    }
  }

  async function fetchAnswersByDate(list, targetDate) {
    var foundItem;
    const lisst = await list;
    for (let i = 0; i < lisst.length; i++) {
      if (lisst[i].date === targetDate) {
        foundItem = lisst[i];
      }
    }
    const answers = foundItem ? foundItem.answers : null;
    return answers
  }

  function formatDate(date) {
    const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' });
    return formatter.format(date);
  }

  function getPast7Days(dateString) {
    // Parse the input date
    const inputDate = new Date(dateString);
  
    // Initialize an array to store the past 7 days
    const past7Days = [];
  
    // Loop to calculate each of the past 7 days
    for (let i = 6; i >= 0; i--) {
      const pastDate = new Date(inputDate);
      pastDate.setDate(inputDate.getDate() - i); // Subtract i days from the input date
  
      // Format the date to "yyyy-mm-dd"
      past7Days.push(formatDate(pastDate));
    }
    return past7Days;
  }

  async function createWeeklyData(past7days, questionIndex) {
    const weeklyData = {};
    for (let i = 0; i < 7; i++) {
      const data = await fetchAllSubmissions(user.uid);
      const ans = await fetchAnswersByDate(data, past7days[i]);
      weeklyData[past7days[i]] = ans ? ans[questionIndex] : null;
    }
    console.log("week data", weeklyData);
    return weeklyData;
  }

  function moodToIndex(mood) {
    switch (mood) {
      case "best-mood":
        return 0;
      case "worst-mood":
        return 1;
      case "power":
        return 2;
      case "worried":
        return 3;
      case "irritability":
        return 4;
    }
  }

  async function generateWeeklyMoodChart(mood){
    const moodIndex = moodToIndex(mood);
    var title;

    const data = await createWeeklyData(getPast7Days(formatDate(new Date)), moodIndex);

    title = "Weekly Data (" + Object.keys(data)[0] + " to " + Object.keys(data)[6] + ')';
    
    const chartData = {
      labels: Object.keys(data),
      datasets: [
        {
          label: "Survey Results",
          data: Object.values(data),
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          borderWidth: 1,
        },
      ],
    };

    setWeekSurveyData(chartData);
    setWeekChartTitle(title);
  }

  function getPast30Days(dateString) {
    const past30Days = [];
    const inputDate = new Date(dateString);

    for (let i = 29; i >= 0; i--) {
      const pastDate = new Date(inputDate);
      pastDate.setDate(inputDate.getDate() - i); // Subtract i days from the input date
  
      // Format the date to "yyyy-mm-dd"
      past30Days.push(formatDate(pastDate));
    }
    return past30Days;
  }

  async function createMonthlyData(past30Days, questionIndex) {
    const monthlyData = {};
    for (let i = 0; i < 30; i++) {
      const data = await fetchAllSubmissions(user.uid);
      const ans = await fetchAnswersByDate(data, past30Days[i]);
      monthlyData[past30Days[i]] = ans ? ans[questionIndex] : null;
    }
    console.log("month data", monthlyData);
    return monthlyData;
  }

  async function generateMonthlyMoodChart(mood){
    const moodIndex = moodToIndex(mood);
    var title;

    const data = await createMonthlyData(getPast30Days(formatDate(new Date())), moodIndex);

    title = "Data from Past 30 Days (" + Object.keys(data)[0] + " to " + Object.keys(data)[29] + ')';
    
    const chartData = {
      labels: Object.keys(data),
      datasets: [
        {
          label: "Survey Results",
          data: Object.values(data),
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          borderWidth: 1,
        },
      ],
    };

    setMonthSurveyData(chartData);
    setMonthChartTitle(title);
  }

  useEffect(() => {
    const auth = getAuth();
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        console.log("Persistence set to localStorage");
      })
      .catch((error) => {
        console.error("Error setting persistence: ", error);
      });
  }, []);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // If the user is logged in, set the user object
      } else {
        setUser(null); // If the user is logged out, clear the user object
      }
    });

    return () => unsubscribe(); // Clean up the listener on unmount
  });

  useEffect(() => {
    if (user) {
    async function loadResults() {
        const weekData = await createWeeklyData(getPast7Days(new Date().toISOString().split("T")[0]), 0);
        const weekTitle = "Weekly Data (" + Object.keys(weekData)[0] + " to " + Object.keys(weekData)[6] + ')';

        const monthData = await createMonthlyData(getPast30Days(new Date().toISOString().split("T")[0]), 0);
        const monthTitle = "Data from Past 30 Days (" + Object.keys(monthData)[0] + " to " + Object.keys(monthData)[29] + ')';
  
        if (weekData) {
          const weekChartData = {
            labels: Object.keys(weekData),
            datasets: [
              {
                label: "Survey Results",
                data: Object.values(weekData),
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)",
                borderWidth: 1,
              },
            ],
          };
          setWeekSurveyData(weekChartData);
          setWeekChartTitle(weekTitle);
        } else {
          setWeekSurveyData(null);
          setWeekChartTitle(weekTitle);
        }

      if (monthData) {
        const monthChartData = {
          labels: Object.keys(monthData),
          datasets: [
            {
              label: "Survey Results",
              data: Object.values(monthData),
              backgroundColor: "rgba(75,192,192,0.4)",
              borderColor: "rgba(75,192,192,1)",
              borderWidth: 1,
            },
          ],
        };
        setMonthSurveyData(monthChartData);
        setMonthChartTitle(monthTitle);
      } else {
        setWeekSurveyData(null);
        setWeekChartTitle(monthTitle);   
      }
      setLoading(false);
    }
    loadResults();
  }
  }, [user]);

  if (loading) {
    return <div id="loading-container"><ReactLoading type={'spokes'} color={'#080357'} height={50} width={50} /></div>;
  }

  const logOut = () => {
    navigate("/");
    signOut(auth);
    setUser(null);
  };

  function toSurvey() {
    navigate("/");
  }

  return (
    <div>
      <div id="header-top">
        <button id="sign-out-button" onClick={logOut}>sign out</button>
        <button id="view-log-button" onClick={toSurvey}>enter today's mood</button>
      </div>
      <div id="header-bottom"></div>
      <h1>Results</h1>
      <div id="dropdown-container">
      <select id="question-dropdown" onChange={(e) => {
        generateWeeklyMoodChart(e.target.value);
        generateMonthlyMoodChart(e.target.value);
      }}>
        <option value="best-mood">Best Mood</option>
        <option value="worst-mood">Worst Mood</option>
        <option value="power">Power</option>
        <option value="worried">Worried/Fearful</option>
        <option value="irritability">Irritability</option>
      </select>
      </div>
      {weekSurveyData ? (
        <LineChart chartData={weekSurveyData} chartTitle={weekChartTitle}/>
      ) : (
        <p>No survey data found.</p>
      )}
      {monthSurveyData ? (
        <LineChart chartData={monthSurveyData} chartTitle={monthChartTitle}/>
      ) : (
        <p>No survey data found.</p>
      )}
    </div>
  );
}

export default ResultsPage;
