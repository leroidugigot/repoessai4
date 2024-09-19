exports.sellpagemain = async (req, res, next) => {
    try {
        // Retrieve necessary data based on the request parameters (e.g., teacher ID)
        const teacherId = req.params.teacherId; // Assuming teacher ID is passed in the URL
        const teacherData = await fetchTeacherData(teacherId); // Replace with actual data fetching logic

        // If teacher data is found, send a JSON response with details
        if (teacherData) {
            res.json({
                message: "Enseigner details",
                teacher: teacherData, // Include the retrieved teacher details
            });
        } else {
            // Handle case where teacher data is not found
            res.status(404).json({ error: "Enseigner not found" });
        }
    } catch (error) {
        // Handle potential errors during data fetching or processing
        console.error("Error fetching enseigner details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};