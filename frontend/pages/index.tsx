import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import Header from "../components/Header";
import ToffeeSale from "../components/ToffeeSale";
import Tab from "../components/Tab";

const Home: NextPage = () => {
  return (
    <div className={styles.container} style={{ marginBottom: "5em" }}>
      <Header />
      <Tab selected="sale" />
      <ToffeeSale />
    </div>
  );
};

export default Home;
