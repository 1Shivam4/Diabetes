import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PieChart } from "@mui/x-charts/PieChart";
import { FlexDiv } from "../components/ui/CommonStyles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo, faXmark } from "@fortawesome/free-solid-svg-icons";
import { testBenchmarks } from "../utils/var";
import {
  getAverageTestData,
  getAllTestData,
  getSingleReport,
  deleteReport,
} from "../utils/user.services";

import styled from "styled-components";
import { toast, Toaster } from "sonner";

export default function UserReport() {
  const [isLoading, setIsLoading] = useState(false);
  const [isPopupOpen, setIsPopUpOpen] = useState(false);
  const [averageTestData, setAverageTestData] = useState([]);
  const [allTestData, setAllTestData] = useState([]);
  const [showSingleReport, setShowSingleReport] = useState(false);
  const [singleReportData, setSingleReportData] = useState([]);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userData"));

  useEffect(() => {
    fetchAvgData();
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setIsLoading(true);
    const res = await getAllTestData();
    setAllTestData(res.data);
  };

  const fetchAvgData = async () => {
    setIsLoading(true);
    const res = await getAverageTestData();
    const rawData = res.data[0];

    const transformedData = [
      { id: 1, value: rawData.averageBMI.toFixed(2), label: "BMI" },
      {
        id: 2,
        value: rawData.averagePhysicalHealth.toFixed(2),
        label: "Physical Health",
      },
      { id: 3, value: rawData.averageIncome.toFixed(2), label: "Income" },
      {
        id: 4,
        value: rawData.averagePedication.toFixed(2),
        label: "Predication",
      },
    ];

    setAverageTestData(transformedData);
    setIsLoading(false);
  };

  function handleLogout() {
    localStorage.removeItem("userData");
    localStorage.removeItem("userToken");
    navigate("/");
  }

  function handlePopUp() {
    setIsPopUpOpen(true);
  }
  function handlePopUpClose() {
    setIsPopUpOpen(false);
    setShowSingleReport(false);
  }
  async function handleDelete(reportId) {
    const data = await deleteReport(reportId);
    toast.error(data.message);
  }

  async function handleSingleReport(reportID) {
    const report = await getSingleReport(reportID);
    setShowSingleReport(true);
    setSingleReportData(report);
  }

  const valueFormatter = (params) => `${params.value}%`;
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <main className="flex-1 p-8 relative">
        <div className="flex justify-between align-middle">
          <h1 className="text-2xl font-semibold mb-6">{user.name}</h1>
          <button
            className="h-10 p-1 font-semibold text-sm bg-red-500 rounded-md text-white"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        {isPopupOpen && <PopUpContainer handlePopUpClose={handlePopUpClose} />}
        {showSingleReport && (
          <SingleReport
            report={singleReportData}
            handlePopUpClose={handlePopUpClose}
          />
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <FlexDiv className="border-b-2 mb-6 relative">
            <h2 className="p-1 text-xl font-bold text-gray-600">Test Report</h2>
            <button
              onClick={handlePopUp}
              className="h-7 w-7 text-center rounded-full bg-slate-500 text-white info"
            >
              <FontAwesomeIcon icon={faInfo} /> <p className="toolTip">Info</p>
            </button>
          </FlexDiv>

          <FlexDiv>
            <div className="w-full p-4 bg-white rounded-lg shadow-md border">
              <h3 className="text-lg font-bold text-gray-600 mb-2">
                Health Stats Overview
              </h3>

              <PieChart
                series={[
                  {
                    data: averageTestData,
                    highlightScope: { fade: "global", highlight: "item" },
                    faded: {
                      innerRadius: 40,
                      additionalRadius: -30,
                      color: "pink",
                    },
                    valueFormatter,
                  },
                ]}
                height={300}
              />
            </div>

            <table className="w-full bg-white border rounded-lg my-10">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b">Factor</th>
                  <th className="py-2 px-4 border-b">Result</th>
                </tr>
              </thead>
              <tbody>
                {averageTestData.map((d, index) => (
                  <tr key={index} className="text-center">
                    <td className="py-2 px-4 border-b">{d.label}</td>
                    <td className="py-2 px-4 border-b">{d.value}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </FlexDiv>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">All Reports</h2>
          <table className="min-w-full bg-white border rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b">Test ID</th>
                <th className="py-2 px-4 border-b">Date</th>
                <th className="py-2 px-4 border-b">Delete Report</th>
              </tr>
            </thead>
            <tbody>
              {allTestData.map((data) => (
                <tr key={data._id} className="text-center">
                  <td
                    className="py-2 px-4 border-b"
                    onClick={() => handleSingleReport(data._id)}
                  >
                    {data._id}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {data?.createdAt?.split("T")[0]}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      className="h-10 p-1 font-semibold text-sm hover:bg-red-500 rounded-md hover:text-white"
                      onClick={() => handleDelete(data._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <Toaster richColors position="top-right" />
    </div>
  );
}

function SingleReport({ report, handlePopUpClose }) {
  const { BMI, physicalHealth, Income, predictionData } = report.data;
  const transformedData = [
    { id: 1, value: BMI, label: "BMI" },
    { id: 2, value: physicalHealth, label: "Physical Health" },
    { id: 3, value: Income, label: "Income" },
    { id: 4, value: predictionData, label: "Predication" },
  ];

  const valueFormatter = (params) => `${params.value}%`;
  return (
    <InfoContainer>
      <FlexDiv className="border-b-2 mb-5">
        <h2 className="text-2xl font-semibold">Test Report</h2>
        <button
          onClick={handlePopUpClose}
          className="h-7 w-7 text-center rounded-full"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </FlexDiv>
      <FlexDiv>
        <div className="w-full p-4 border">
          <h3 className="text-lg font-bold text-gray-600 mb-2">
            Health Stats Overview
          </h3>

          <PieChart
            series={[
              {
                data: transformedData,
                highlightScope: { fade: "global", highlight: "item" },
                faded: {
                  innerRadius: 40,
                  additionalRadius: -30,
                  color: "pink",
                },
                valueFormatter,
              },
            ]}
            height={300}
          />
        </div>
      </FlexDiv>
    </InfoContainer>
  );
}

export function PopUpContainer({ handlePopUpClose }) {
  return (
    <InfoContainer>
      <FlexDiv className="border-b-2 mb-5">
        <h2 className="text-2xl font-semibold">Test Benchmarks</h2>
        <button
          onClick={handlePopUpClose}
          className="h-7 w-7 text-center rounded-full"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </FlexDiv>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {testBenchmarks.map((test, index) => (
          <InfoDetailsConatiner
            key={index}
            name={test.type}
            desc={test.description}
            values={test.values}
          />
        ))}
      </div>
    </InfoContainer>
  );
}

function InfoDetailsConatiner({ name, desc, values }) {
  return (
    <InfoDetails className="flex flex-col gap-4 border-2 border-slate-200 justify-between">
      <h3 className="text-lg font-semibold text-slate-700">{name}</h3>
      <p className="text-md">
        <em>{desc}</em>
      </p>
      <details className="border rounded p-2">
        <summary className="cursor-pointer font-semibold text-slate-700">
          Details
        </summary>
        <div className="mt-2 pl-4 text-gray-700">
          <ul className="list-disc pl-4">
            {values.map((el, index) => (
              <li key={index}>
                {el.key} = {el.value}
              </li>
            ))}
          </ul>
        </div>
      </details>
    </InfoDetails>
  );
}

const InfoDetails = styled.div`
  width: 400px;
  padding: 10px;
  margin: 2px;
  border-radius: 3px;
  transition: 0.2s;

  &:hover {
    scale: 1.01;
  }
`;

const InfoContainer = styled.div`
  position: fixed; /* covers entire screen */
  top: 30px;
  left: 30px;
  width: 90vw;
  height: 90vh;
  padding: 20px;
  border-radius: 16px;
  overflow: hidden;
  z-index: 10;
  backdrop-filter: blur(10px);
  background-color: white;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  overflow-y: scroll;
`;
