import React, { Component } from "react";
import Wrapper from "./components/Wrapper";
import Header from "./components/Header";
import Footer from "./components/Footer";
import moment from 'moment';
import ReactTable from 'react-table';
import 'flatpickr/dist/themes/material_blue.css'
import Flatpickr from 'react-flatpickr'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import API from "./utils/API";
import "react-table/react-table.css";
import isURL from 'is-url';

const yearNow = moment().format("YYYY");

class App extends Component {
  state = {
    students: [],
    columns: [],
    loadingText: false,
    pageSize: 10,
    filtered: [],
    highest: 0,
    lowest: 4,
    newName: "",
    newGender: "M",
    newBirthday: "",
    newGrade: "1",
    newImage: "https://i.pravatar.cc/100",
    newMath: "A",
    newHistory: "A",
    newScience: "A",
    newEnglish: "A",
    newAthlete: false,
    id: 0,
    isHidden: true
  };

  /**
   * function to toggle Show/Hide Student Form
   */
  toggleHidden() {
    this.setState({
      isHidden: !this.state.isHidden
    })
  }

  /**
   * Function to validate URL
   * @param {*} str 
   */
  validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
  }

  /**
   * Funtion to add student
   */
  addStudent = (event) => {
    event.preventDefault();
    let newStudents = {};
    if (isNaN(this.state.newName) && this.state.newName && this.state.newGender && this.state.newBirthday && this.state.newGrade && this.state.newImage && this.state.newMath && this.state.newHistory && this.state.newScience && this.state.newEnglish) {
      if (!isURL(this.state.newImage)) {
        alert("Please enter a valid image url and make sure it starts with http:// or https://");
        return;
      }
      newStudents._id = this.state.id + 1;
      newStudents.name = this.state.newName;
      newStudents.grades = ["Math - " + this.state.newMath, "History - " + this.state.newHistory, "Science - " + this.state.newScience, "English - " + this.state.newEnglish];
      newStudents.img = this.state.newImage;
      newStudents.gender = this.state.newGender;
      let day = moment(this.state.newBirthday[0]).format("MMMM d, Y");
      newStudents.birthday = day;
      newStudents.athlete = this.state.newAthlete;
      newStudents.grade = this.state.newGrade;
      API.addStudent(newStudents)
        .then(res => {
          this.setState({
            newName: "",
            newGender: "M",
            newBirthday: "",
            newImage: "https://i.pravatar.cc/300",
            newMath: "A",
            newHistory: "A",
            newScience: "A",
            newEnglish: "A",
            newAthlete: false,
            newGrade: "1"
          });
          API.getAllStudents()
            .then(res => {
              this.setState({ students: res.data })
              this.generateData();
            }).catch(err => console.log(err));
          alert(`Added new student ${res.data.name}`);
        }).catch(err => {
          console.log(err);
          alert(`There was an error adding a new student. Please try again.`);
        });
    } else {
      alert("Please fill up all fields in student form properly. Make sure the name is not a number and the image url is working.");
    }
  }

  /**
   * Function to delete a student
   */
  deleteStudent = (student) => {
    confirmAlert({
      title: 'Delete student: ' + student.name,
      message: 'Are you sure you want to do this?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            API.deleteStudent(student)
              .then(res => {
                this.setState({ students: res.data })
                this.generateData();
              }).catch(err => console.log(err));
          }
        },
        {
          label: "No"
        }
      ]
    });
  };

  /**
   * Function to update state value using name
   */
  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  /**
   * Function to upate newBirthday value
   */
  handleDateChange = val => {
    this.setState({
      newBirthday: val
    });
  };

  /**
   * Function to to generate and process data on student table 
   */
  generateData = () => {
    let data = this.state.students.data;
    let newState = { data: [] };
    let lowest = 4, highest = 0;
    data.forEach((dt, idx) => {
      let newStudent = { name: dt.name, gender: dt.gender, birthday: dt.birthday, img: dt.img, grade: dt.grade, _id: dt._id };
      newStudent.athlete = (dt.athlete) ? newStudent.athlete = "Yes" : "No";
      let total = 0;
      let GPA = 0;
      dt.grades.forEach(subjects => {
        let subject = subjects.split(" - ");
        if (subject[1]) {
          if (subject[1] === "A") total += 4;
          if (subject[1] === "B") total += 3;
          if (subject[1] === "C") total += 2;
          if (subject[1] === "D") total += 1;
          if (subject[1] === "F") total += 0;
        } else {
          total += 0;
        }

        if (subject[0] === "Math") {
          newStudent.math = subject[1];
        } else if (subject[0] === "History") {
          newStudent.history = subject[1];
        } else if (subject[0] === "Science") {
          newStudent.science = subject[1];
        } else if (subject[0] === "English") {
          newStudent.english = subject[1];
        }
      });

      GPA = total / 4;
      newStudent.gpa = GPA;
      if (GPA > highest) highest = GPA;
      if (GPA < lowest) lowest = GPA;
      if (idx >= data.length - 1) this.setState({ id: dt._id });
      newState.data.push(newStudent);
    });
    this.setState({ students: newState, highest, lowest });
  }

  /**
   * Functio that generates data used for React table
   */
  generateColumns = () => {
    this.setState({
      columns: [{
        Header: 'Name',
        accessor: 'name',
        style: { textAlign: 'center' },
        headerStyle: { textAlign: 'center' },
      },
      {
        Header: 'Math',
        accessor: 'math',
        style: { textAlign: 'center' },
        headerStyle: { textAlign: 'center' },
      },
      {
        Header: 'History',
        accessor: 'history',
        style: { textAlign: 'center' },
        headerStyle: { textAlign: 'center' },
      },
      {
        Header: 'Science',
        accessor: 'science',
        style: { textAlign: 'center' },
        headerStyle: { textAlign: 'center' },
      },
      {
        Header: 'English',
        accessor: 'english',
        style: { textAlign: 'center' },
        headerStyle: { textAlign: 'center' },
      },
      {
        Header: 'GPA',
        accessor: 'gpa',
        style: { textAlign: 'center' },
        headerStyle: { textAlign: 'center' },
      },
      {
        show: false,
        accessor: '_id'
      },
      {
        show: false,
        accessor: 'gender'
      },
      {
        show: false,
        accessor: 'birthday'
      },
      {
        show: false,
        accessor: 'grade'
      },
      {
        show: false,
        accessor: 'athlete'
      },
      {
        show: false,
        accessor: 'img'
      }
      ]
    })
  }

  /**
   * Function called after page is rendered
   */
  componentDidMount() {
    API.getAllStudents()
      .then(res => {
        this.setState({ students: res.data })
        this.generateData();
      })
      .catch(err => console.log(err));
  }

  render() {
    if (Object.entries(this.state.columns).length === 0) this.generateColumns();
    return (
      <Wrapper>
        <Header h1="Students" h2=""></Header>
        <div className="">
          <div className="showHideAddTable">
            <button name="Add" className="btn btn-primary" onClick={this.toggleHidden.bind(this)}>{this.state.isHidden ? "Show Student Form" : "Hide Student Form"}</button>
          </div>
          {!this.state.isHidden &&
            <div className="addTable">
              <table className="table">
                <tbody>
                  <tr>
                    <td>
                      <div className="form-group">
                        <label htmlFor="newName">Name:</label>
                        <input className="form-control" type="text" name="newName" onChange={this.handleInputChange} value={this.state.newName} ></input>
                      </div>
                    </td>
                    <td>
                      <div className="form-group">
                        <label htmlFor="newGender">Gender:</label>
                        <select className="form-control" name="newGender" onChange={this.handleInputChange.bind(this)} value={this.state.newGender}>
                          <option value="M" >Male</option>
                          <option value="F">Female</option>
                        </select>
                      </div>
                    </td>
                    <td>
                      <div className="form-group">
                        <label htmlFor="newBirthday">Birthday:</label>
                        <Flatpickr className="form-control" value={this.state.newBirthday}
                          onChange={date => this.handleDateChange(date)} options={{ maxDate: (yearNow - 3) + '-12-31', dateFormat: "F d, Y", altFormat: "F d, Y", altInput: true }} />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="form-group">
                        <label htmlFor="newGrade">Grade:</label>
                        <select className="form-control" name="newGrade" onChange={this.handleInputChange.bind(this)} value={this.state.newGrade}>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                          <option value="7">7</option>
                          <option value="8">8</option>
                          <option value="9">9</option>
                          <option value="10">10</option>
                          <option value="11">11</option>
                          <option value="12">12</option>
                        </select>
                      </div>
                    </td>
                    <td>
                      <div className="form-group">
                        <label htmlFor="newAthlete">Athlete:</label>
                        <select className="form-control" name="newAthlete" onChange={this.handleInputChange.bind(this)} value={this.state.newAthlete}>
                          <option value={false}>No</option>
                          <option value={true}>Yes</option>
                        </select>
                      </div>
                    </td>
                    <td>
                      <div className="form-group">
                        <label htmlFor="newImage">Image:</label>
                        <input className="form-control" type="text" name="newImage" onChange={this.handleInputChange} value={this.state.newImage}></input>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="3">
                      <table className="table">
                        <tbody>
                          <tr>
                            <td>
                              <div className="form-group">
                                <label htmlFor="newMath">Math:</label>
                                <select className="form-control" name="newMath" onChange={this.handleInputChange.bind(this)} value={this.state.newMath}>
                                  <option value="A">A</option>
                                  <option value="B">B</option>
                                  <option value="C">C</option>
                                  <option value="D">D</option>
                                  <option value="F">F</option>
                                </select>
                              </div>
                            </td>
                            <td>
                              <div className="form-group">
                                <label htmlFor="newHistory">History:</label>
                                <select className="form-control" name="newHistory" onChange={this.handleInputChange.bind(this)} value={this.state.newHistory}>
                                  <option value="A">A</option>
                                  <option value="B">B</option>
                                  <option value="C">C</option>
                                  <option value="D">D</option>
                                  <option value="F">F</option>
                                </select>
                              </div>
                            </td>
                            <td>
                              <div className="form-group">
                                <label htmlFor="newScience">Science:</label>
                                <select className="form-control" name="newScience" onChange={this.handleInputChange.bind(this)} value={this.state.newScience}>
                                  <option value="A">A</option>
                                  <option value="B">B</option>
                                  <option value="C">C</option>
                                  <option value="D">D</option>
                                  <option value="F">F</option>
                                </select>
                              </div>
                            </td>
                            <td>
                              <div className="form-group">
                                <label htmlFor="newEnglish">English:</label>
                                <select className="form-control" name="newEnglish" onChange={this.handleInputChange.bind(this)} value={this.state.newEnglish}>
                                  <option value="A">A</option>
                                  <option value="B">B</option>
                                  <option value="C">C</option>
                                  <option value="D">D</option>
                                  <option value="F">F</option>
                                </select>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="6"><button name="Add" className="btn btn-primary" onClick={this.addStudent}>Add Student</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          }
          <div className="reactTable">
            <ReactTable
              data={this.state.students.data}
              columns={this.state.columns}
              sortable={true}
              multiSort={true}
              resizable={true}
              filterable={true}
              onFilteredChange={filtered => this.setState({ filtered })}
              loading={this.state.loading}
              loadingText={'Loading...'}
              noDataText={'No rows found'}
              defaultFilterMethod={(filter, row) => {
                // console.log(filter.id);
                if (filter.id === 'name' || filter.id === 'math' || filter.id === 'history' || filter.id === 'english' || filter.id === 'science') {
                  return String(row[filter.id]).toLowerCase().includes(String(filter.value).toLowerCase())
                } else {
                  return String(row[filter.id]) === filter.value
                }
              }
              }
              defaultSorted={
                [
                  {
                    id: "_id",
                    desc: false
                  }]}
              defaultPageSize={10}
              pageSize={this.state.pageSize}
              onPageSizeChange={(pageSize) => { this.setState({ pageSize }) }}
              className="-striped -highlight"
              SubComponent={row =>
                <div>
                  <div className="deleteBtn">
                    <button className="btn btn-danger"
                      onClick={() => this.deleteStudent(row.original)}
                    >
                      {"Delete Student"}
                    </button>
                  </div>
                  < div style={{ padding: '10px' }}>
                    <table className="table">
                      <tbody>
                        <tr colSpan="2">
                          <td rowSpan="3">
                            <img className="image" src={row.row.img} alt="Student" />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            Birthday: <b>{row.row.birthday} </b>
                          </td>
                          <td>
                            Gender: <b>{row.row.gender} </b>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            Grade: <b>{row.row.grade} </b>
                          </td>
                          <td>
                            Athlete: <b>{row.row.athlete} </b>
                          </td>
                        </tr>

                        {/* Comment Time: <b>{Moment(row.row.messages[1].timeStamp).format('M/D/YY h:mma')}</b> */}
                      </tbody>
                    </table>
                  </div ></div >}
              getTrProps={(state, rowInfo, column, instance) => {
                if (typeof rowInfo !== "undefined") {
                  let color = "white";
                  if (rowInfo.row.gpa >= this.state.highest) color = "#66af66";
                  else if (rowInfo.row.gpa <= this.state.lowest) color = "#d44f4f";
                  else if (rowInfo.row._index % 2 === 0) color = "#e2dcdc";
                  return {
                    style: { background: color, }
                  }
                } else {
                  return {
                    style: { background: "white", }
                  }
                }
              }}
            />
          </div>
        </div>
        <Footer title="Cara Crotty" url=""><a href="https://www.freepik.com/free-photos-vectors/background">Background photo created by freepik - www.freepik.com</a></Footer>
      </Wrapper>
    );
  }
}

export default App;
