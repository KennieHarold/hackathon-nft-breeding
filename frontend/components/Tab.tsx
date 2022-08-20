import type { NextPage } from "next";

interface TabProps {
  selected: "sale" | "pets" | "breed" | "buy";
}

const Tab: NextPage<TabProps> = ({ selected }) => {
  return (
    <div className="flex flex-row mt-5">
      <button
        className={
          selected === "sale"
            ? "mr-3 px-4 py-2 rounded bg-black text-white"
            : "mr-3 px-4 py-2 rounded text-black border-2 border-black"
        }
        onClick={() => (window.location.href = "/")}
      >
        For sale
      </button>

      <button
        className={
          selected === "pets"
            ? "mr-3 px-4 py-2 rounded bg-black text-white"
            : "mr-3 px-4 py-2 rounded text-black border-2 border-black"
        }
        onClick={() => (window.location.href = "/pets")}
      >
        My Toffee Pets
      </button>

      <button
        className={
          selected === "breed"
            ? "mr-3 px-4 py-2 rounded bg-black text-white"
            : "mr-3 px-4 py-2 rounded text-black border-2 border-black"
        }
        onClick={() => (window.location.href = "/breed")}
      >
        Breed
      </button>

      {/* <button
        className={
          selected === "buy"
            ? "mr-3 px-4 py-2 rounded bg-black text-white"
            : "mr-3 px-4 py-2 rounded text-black border-2 border-black"
        }
        onClick={() => (window.location.href = "/buy")}
      >
        Buy Toffee
      </button> */}
    </div>
  );
};

export default Tab;
