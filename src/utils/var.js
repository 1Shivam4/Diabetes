export const LoginOrRegister = [
  {
    type: "Login",
    fields: [
      {
        name: "email",
        label: "Email",
        placeholder: "Enter your email",
        type: "email",
      },
      {
        name: "password",
        label: "Password",
        placeholder: "Enter your password",
        type: "password",
      },
    ],
  },
  {
    type: "Register",
    fields: [
      {
        name: "name",
        label: "Name",
        placeholder: "Enter your name",
        type: "text",
      },
      {
        name: "email",
        label: "Email",
        placeholder: "Enter your email",
        type: "email",
      },
      {
        name: "password",
        label: "Password",
        placeholder: "Enter your password",
        type: "password",
      },
      {
        name: "confirmPassword",
        label: "Confirm Password",
        placeholder: "Re-enter password",
        type: "password",
      },
    ],
  },
];

export const testBenchmarks = [
  {
    type: "HighBP",
    description:
      "Indicates whether the individual has been told they have high blood pressure (hypertension).",
    values: [
      { key: 0, value: "No - normal blood pressure" },
      { key: 1, value: "Yes - high blood pressure" },
    ],
  },
  {
    type: "High Cholesterol",
    description:
      "Indicates whether the individual has been diagnosed with high cholesterol.",
    values: [
      { key: 0, value: "No - normal cholesterol" },
      { key: 1, value: "Yes - high cholesterol" },
    ],
  },
  {
    type: "BMI",
    description:
      "Body Mass Index — a measure of body fat based on height and weight.",
    values: [
      { key: "<18.5", value: "Underweight" },
      { key: "18.5–24.9", value: "Normal" },
      { key: "25–29.9", value: "Overweight" },
      { key: "30+", value: "Obese" },
    ],
  },
  {
    type: "Stroke",
    description: "Indicates if the individual has ever had a stroke.",
    values: [
      { key: 0, value: "No" },
      { key: 1, value: "Yes" },
    ],
  },
  {
    type: "Heart Disease or Attack",
    description:
      "Indicates if the individual has been diagnosed with coronary heart disease or suffered a heart attack.",
    values: [
      { key: 0, value: "No" },
      { key: 1, value: "Yes" },
    ],
  },
  {
    type: "Physical Activity",
    description:
      "Indicates whether the individual has engaged in physical activity (other than regular job) in the past 30 days.",
    values: [
      { key: 0, value: "No physical activity" },
      { key: 1, value: "Physically active" },
    ],
  },
  {
    type: "Heavy Alcohol Consumption",
    description:
      "Indicates heavy alcohol consumption: Men >14 drinks/week, Women >7 drinks/week.",
    values: [
      { key: 0, value: "No heavy alcohol use" },
      { key: 1, value: "Heavy alcohol consumption" },
    ],
  },
  {
    type: "General Health",
    description: "Self-reported general health on a 5-point scale.",
    values: [
      { key: 1, value: "Excellent" },
      { key: 2, value: "Very good" },
      { key: 3, value: "Good" },
      { key: 4, value: "Fair" },
      { key: 5, value: "Poor" },
    ],
  },
  {
    type: "Mental Health",
    description:
      "Number of days (out of the past 30) when mental health was not good (e.g., stress, depression).",
    values: [
      { key: "0–30", value: "Higher numbers indicate poorer mental health." },
    ],
  },
  {
    type: "Physical Health",
    description:
      "Number of days (out of the past 30) when physical health was not good (e.g., illness, injury).",
    values: [
      { key: "0–30", value: "Higher numbers indicate worse physical health." },
    ],
  },
  {
    type: "Difficult Walks",
    description:
      "Indicates if the individual has serious difficulty walking or climbing stairs.",
    values: [
      { key: 0, value: "No difficulty" },
      { key: 1, value: "Has difficulty walking" },
    ],
  },
  {
    type: "Age",
    description: "Age group coded as a categorical value.",
    values: [
      { key: 1, value: "18–24" },
      { key: 2, value: "25–29" },
      { key: 3, value: "30–34" },
      { key: 4, value: "35–39" },
      { key: 5, value: "40–44" },
      { key: 6, value: "45–49" },
      { key: 7, value: "50–54" },
      { key: 8, value: "55–59" },
      { key: 9, value: "60–64" },
      { key: 10, value: "65–69" },
      { key: 11, value: "70–74" },
      { key: 12, value: "75–79" },
      { key: 13, value: "80 or older" },
    ],
  },
  {
    type: "Income",
    description: "Income group coded as a categorical value.",
    values: [
      { key: 1, value: "< $10,000" },
      { key: 2, value: "$10,000 – $14,999" },
      { key: 3, value: "$15,000 – $19,999" },
      { key: 4, value: "$20,000 – $24,999" },
      { key: 5, value: "$25,000 – $34,999" },
      { key: 6, value: "$35,000 – $49,999" },
      { key: 7, value: "$50,000 – $74,999" },
      { key: 8, value: "$75,000 or more" },
    ],
  },
];

export const HealthForm = [
  {
    name: "HighBP",
    label: "High Blood Pressure",
    placeholder: "Enter 0 or 1",
    type: "number",
  },
  {
    name: "HighChol",
    label: "High Cholesterol",
    placeholder: "Enter 0 or 1",
    type: "number",
  },
  {
    name: "BMI",
    label: "BMI",
    placeholder: "Enter BMI value",
    type: "number",
  },
  {
    name: "Stroke",
    label: "Stroke History",
    placeholder: "Enter 0 or 1",
    type: "number",
  },
  {
    name: "HeartDiseaseorAttack",
    label: "Heart Disease or Attack",
    placeholder: "Enter 0 or 1",
    type: "number",
  },
  {
    name: "PhysActivity",
    label: "Physical Activity",
    placeholder: "Enter 0 or 1",
    type: "number",
  },
  {
    name: "HvyAlcoholConsump",
    label: "Heavy Alcohol Consumption",
    placeholder: "Enter 0 or 1",
    type: "number",
  },
  {
    name: "GenHlth",
    label: "General Health",
    placeholder: "Enter health level (1-5)",
    type: "number",
  },
  {
    name: "MentHlth",
    label: "Mental Health",
    placeholder: "Enter number of bad mental health days",
    type: "number",
  },
  {
    name: "PhysHlth",
    label: "Physical Health",
    placeholder: "Enter number of bad physical health days",
    type: "number",
  },
  {
    name: "DiffWalk",
    label: "Difficulty Walking",
    placeholder: "Enter 0 or 1",
    type: "number",
  },
  {
    name: "Age",
    label: "Age Category",
    placeholder: "Enter age code",
    type: "number",
  },
  {
    name: "Income",
    label: "Income Level",
    placeholder: "Enter income code",
    type: "number",
  },
];
