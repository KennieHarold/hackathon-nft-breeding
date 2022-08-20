import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import Header from "../components/Header";
import Tab from "../components/Tab";
import BreedFactory from "../components/BreedFactory";

const Breed: NextPage = () => {
  return (
    <div className={styles.container} style={{ marginBottom: "5em" }}>
      <Header />
      <Tab selected={"breed"} />
      <BreedFactory />
    </div>
  );
};

export default Breed;
