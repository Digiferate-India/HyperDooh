// In src/pages/PairScreen.jsx
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

function PairScreen() {
  const [customName, setCustomName] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [screens, setScreens] = useState([]);
  const [isLoadingList, setIsLoadingList] = useState(true);

  const fetchScreens = async () => {
    // ... (This function is the same as before)
    setIsLoadingList(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setScreens([]);
        return;
      }
      const { data, error } = await supabase
        .from("screens")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) {
        setScreens(data);
      }
    } catch (error) {
      console.error("Error fetching screens:", error.message);
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    fetchScreens();
  }, []);

  const handleSubmit = async (event) => {
    // ... (This function is the same as before)
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("You must be logged in to create a screen.");
      }
      const pairingCode = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();
      const newScreen = {
        custom_name: customName,
        area: area,
        city: city,
        pairing_code: pairingCode,
        user_id: user.id,
      };
      const { error } = await supabase.from("screens").insert([newScreen]);
      if (error) throw error;
      alert(`Screen created successfully! Your code is: ${pairingCode}`);
      setCustomName("");
      setArea("");
      setCity("");
      fetchScreens();
    } catch (error) {
      alert("Error creating screen: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Step 1: Add the new handleDelete function
  const handleDelete = async (screenId) => {
    // Ask for confirmation before deleting
    if (!window.confirm("Are you sure you want to delete this screen?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("screens")
        .delete()
        .eq("id", screenId); // Delete the row where the id matches

      if (error) throw error;

      alert("Screen deleted successfully!");
      fetchScreens(); // Refresh the list of screens
    } catch (error) {
      alert("Error deleting screen: " + error.message);
    }
  };

  return (
    <div>
      <h1>Pair a New Screen</h1>
      <form onSubmit={handleSubmit}>
        {/* ...form inputs... (same as before) */}
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="customName" style={{ display: "block" }}>
            Custom Name
          </label>
         <input
  id="customName"
  type="text"
  value={customName}
  onChange={(e) => setCustomName(e.target.value)}
  required
  style={{
    width: '100%',
    padding: '10px 14px',
    border: '2px solid #555',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    color: '#fff',
    outline: 'none',
    fontSize: '16px',
    transition: 'border-color 0.2s ease',
  }}
  onFocus={(e) => (e.target.style.borderColor = '#00bcd4')}
  onBlur={(e) => (e.target.style.borderColor = '#555')}
/>

        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="area" style={{ display: "block" }}>
            Area
          </label>
          <input
            id="area"
            type="text"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            required
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="city" style={{ display: "block" }}>
            City
          </label>
          <input
            id="city"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            backgroundColor: isSubmitting ? "#888" : "#007bff",
            color: "#fff",
            padding: "10px 18px",
            border: "none",
            borderRadius: "6px",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            fontSize: "16px",
            fontWeight: "500",
            transition: "background-color 0.3s ease",
          }}
        >
          {isSubmitting ? "Creating..." : "Create Screen"}
        </button>
      </form>

      <hr style={{ margin: "2rem 0" }} />

      <h2>Existing Screens</h2>
      {isLoadingList ? (
        <p>Loading screens...</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #ccc" }}>
              <th style={{ padding: "8px", textAlign: "left" }}>Name</th>
              <th style={{ padding: "8px", textAlign: "left" }}>
                Pairing Code
              </th>
              <th style={{ padding: "8px", textAlign: "left" }}>Status</th>
              <th style={{ padding: "8px", textAlign: "left" }}>Paired At</th>
              {/* ✅ Step 2: Add a header for the new column */}
              <th style={{ padding: "8px", textAlign: "left" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {screens.map((screen) => (
              <tr key={screen.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "8px" }}>{screen.custom_name}</td>
                <td style={{ padding: "8px" }}>{screen.pairing_code}</td>
                <td style={{ padding: "8px" }}>
                  <span
                    style={{
                      color: screen.status === "paired" ? "green" : "orange",
                      fontWeight: "bold",
                    }}
                  >
                    {screen.status}
                  </span>
                </td>
                <td style={{ padding: "8px" }}>
                  {screen.paired_at
                    ? new Date(screen.paired_at).toLocaleString()
                    : "N/A"}
                </td>
                {/* ✅ Step 3: Add the cell with the delete button */}
                <td style={{ padding: "8px" }}>
                  <button
                    onClick={() => handleDelete(screen.id)}
                    style={{ color: "red" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PairScreen;
