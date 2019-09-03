import axios from "axios";

export default {
    getAllStudents: function () {
        return axios.get("/api/students");
    },

    addStudent: function (student) {
        return axios.post("/api/new", student);
    },

    deleteStudent: function (student) {
        return axios.post("/api/delete", student);
    }
}