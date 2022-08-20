import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import Header from "../components/Header";
import Tab from "../components/Tab";
import MyPets from "../components/MyPets";

const Pets: NextPage = () => {
  return (
    <div className={styles.container} style={{ marginBottom: "5em" }}>
      <Header />
      <Tab selected={"pets"} />
      <MyPets />
    </div>
  );
};

export default Pets;
