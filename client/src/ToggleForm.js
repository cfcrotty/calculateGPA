import React, { Component } from "react";
import { toggleForm } from './redux';
import { connect } from "react-redux";

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showHide: false
    }
  }
  
  someFn = (val) => {
    this.props.callbackFromParent(val);
  }

  componentDidMount() {
    this.someFn(true);
  }

  render() {
    return (
      <div className="showHideAddTable">
        <button name="Add" className="btn btn-primary" onClick={() => {
          this.someFn(this.props.form.title);
          if (this.props.form.title) this.props.toggleForm({})
          else this.props.toggleForm({ title: "Yes" })
        }} >{this.props.form.title ? "Hide Student Form" : "Show Student Form"}</button>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  form: state.form,
});

const mapDispatchToProps = {
  toggleForm
};

const ToggleForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(Form);

export default ToggleForm;