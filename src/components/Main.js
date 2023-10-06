import React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Divider from "@mui/material/Divider";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";
import moment from "moment";
import { useState, useEffect } from "react";
import { Box, Container, Paper, styled, useTheme } from "@mui/material";
import DividerStack from "./Cards";
import Photo1 from "../image/asr-prayer-mosque.png";
import Photo2 from "../image/dhhr-prayer-mosque.png";
import Photo3 from "../image/fajr-prayer.png";
import Photo4 from "../image/night-prayer-mosque.png";
import Photo5 from "../image/sunset-prayer-mosque.png";
import PageTheme from "../theme/PageTheme";
import "moment/locale/ar-dz";

moment.locale("ar");
export default function MainContent() {
  // STATES

  const [nextPrayerIndex, setNextPrayerIndex] = useState(2);
  const [timings, setTimings] = useState({
    Fajr: "04:20",
    Dhuhr: "11:50",
    Asr: "15:18",
    Sunset: "18:03",
    Isha: "19:33",
  });

  const [remainingTime, setRemainingTime] = useState("");

  const [selectedCity, setSelectedCity] = useState({
    name: "مصر",
    code: "EG",
  });

  const [today, setToday] = useState("");

  const arabicCountries = [
    { name: "الجزائر", code: "DZ" },
    { name: "البحرين", code: "BH" },
    { name: "جيبوتي", code: "DJ" },
    { name: "مصر", code: "EG" },
    { name: "العراق", code: "IQ" },
    { name: "الأردن", code: "JO" },
    { name: "الكويت", code: "KW" },
    { name: "لبنان", code: "LB" },
    { name: "ليبيا", code: "LY" },
    { name: "موريتانيا", code: "MR" },
    { name: "المغرب", code: "MA" },
    { name: "عُمان", code: "OM" },
    { name: "فلسطين", code: "PS" },
    { name: "قطر", code: "QA" },
    { name: "السعودية", code: "SA" },
    { name: "الصومال", code: "SO" },
    { name: "السودان", code: "SD" },
    { name: "سوريا", code: "SY" },
    { name: "تونس", code: "TN" },
    { name: "الإمارات العربية المتحدة", code: "AE" },
    { name: "اليمن", code: "YE" },
  ];

  const prayersArray = [
    { key: "Fajr", displayName: "الفجر" },
    { key: "Dhuhr", displayName: "الظهر" },
    { key: "Asr", displayName: "العصر" },
    { key: "Sunset", displayName: "المغرب" },
    { key: "Isha", displayName: "العشاء" },
  ];

  const currentDateTime = moment().format("DD-MM-YYYY");
  console.log(currentDateTime);

  const getTimings = async () => {
    console.log("calling the api");
    const response = await axios.get(
      `https://api.aladhan.com/v1/timingsByAddress/${currentDateTime}?address=${selectedCity.code}`
    );
    setTimings(response.data.data.timings);
  };
  useEffect(() => {
    getTimings();
  }, [selectedCity]);

  useEffect(() => {
    let interval = setInterval(() => {
      console.log("calling timer");
      setupCountdownTimer();
    }, 1000);

    const t = moment();
    setToday(t.format("MMM Do YYYY | h:mm"));

    return () => {
      clearInterval(interval);
    };
  }, [timings]);
  const theme = useTheme();
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#0a0c0e" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  const setupCountdownTimer = () => {
    const momentNow = moment();

    let prayerIndex = 2;

    if (
      momentNow.isAfter(moment(timings["Fajr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Dhuhr"], "hh:mm"))
    ) {
      prayerIndex = 1;
    } else if (
      momentNow.isAfter(moment(timings["Dhuhr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Asr"], "hh:mm"))
    ) {
      prayerIndex = 2;
    } else if (
      momentNow.isAfter(moment(timings["Asr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Sunset"], "hh:mm"))
    ) {
      prayerIndex = 3;
    } else if (
      momentNow.isAfter(moment(timings["Sunset"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Isha"], "hh:mm"))
    ) {
      prayerIndex = 4;
    } else {
      prayerIndex = 0;
    }

    setNextPrayerIndex(prayerIndex);

    // now after knowing what the next prayer is, we can setup the countdown timer by getting the prayer's time
    const nextPrayerObject = prayersArray[prayerIndex];
    const nextPrayerTime = timings[nextPrayerObject.key];
    const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:mm");

    let remainingTime = moment(nextPrayerTime, "hh:mm").diff(momentNow);

    if (remainingTime < 0) {
      const midnightDiff = moment("23:59:59", "hh:mm:ss").diff(momentNow);
      const fajrToMidnightDiff = nextPrayerTimeMoment.diff(
        moment("00:00:00", "hh:mm:ss")
      );

      const totalDiffernce = midnightDiff + fajrToMidnightDiff;

      remainingTime = totalDiffernce;
    }
    console.log(remainingTime);

    const durationRemainingTime = moment.duration(remainingTime);

    setRemainingTime(
      `${durationRemainingTime.seconds()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.hours()}`
    );
    console.log(
      "duration issss ",
      durationRemainingTime.hours(),
      durationRemainingTime.minutes(),
      durationRemainingTime.seconds()
    );
  };
  const handleCityChange = (event) => {
    const cityObject = arabicCountries.find((city) => {
      return city.code === event.target.value;
    });
    console.log("the new value is ", event.target.value);
    setSelectedCity(cityObject);
  };

  return (
    <div className="main">
      <Container maxWidth="xl">
        <Box sx={{ display: "flex", flexGrow: 1, flexDirection: "column" }}>
          <Grid container spacing={4} sx={{ flexWrap: "nowrap" }}>
            <Grid item sx={{ transform: "translateY(15%)" }}>
              <Item>
                <PageTheme />
              </Item>
            </Grid>
            <Grid item xs={5.5}>
              <Item>
                <h5>{today}</h5>
                <h1 style={{ color: theme.palette.text.primary }}>
                  {selectedCity.name}
                </h1>
              </Item>
            </Grid>
            <Grid item xs={5.5}>
              <Item>
                {" "}
                <h5>
                  متبقي حتي صلاه {prayersArray[nextPrayerIndex].displayName}
                </h5>
                <h1 style={{ color: theme.palette.text.primary }}>
                  {remainingTime}
                </h1>
              </Item>
            </Grid>
          </Grid>
          <Divider sx={{ padding: 1 }} variant="middle" />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 5 }}>
          <FormControl style={{ width: "20%" }}>
            <InputLabel id="demo-simple-select-label">
              <span style={{ fontSize: 25, color: theme.palette.text.primary }}>
                المدينة
              </span>
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="المدينة"
              onChange={handleCityChange}
            >
              {arabicCountries.map((city) => {
                return (
                  <MenuItem key={city.code} value={city.code}>
                    {city.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>
      </Container>
      <div
        className="cards"
        divider={<Divider orientation="vertical" flexItem />}
        spacing={2}
      >
        <DividerStack name={"الفجر"} time={timings.Fajr} image={Photo2} />
        <DividerStack name={"الظهر"} time={timings.Dhuhr} image={Photo1} />
        <DividerStack name={"العصر"} time={timings.Asr} image={Photo3} />
        <DividerStack name={"المغرب"} time={timings.Sunset} image={Photo4} />
        <DividerStack name={"العشاء"} time={timings.Isha} image={Photo5} />
      </div>
    </div>
  );
}
