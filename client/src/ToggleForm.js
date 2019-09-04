import React, { Component } from "react";
import { toggleForm, store } from './redux';
import { connect } from "react-redux";
var state1 = store.getState();

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
          state1 = store.getState();
          //this.someFn(this.props.form.title);
          if (state1.form && state1.form.title) store.dispatch(toggleForm({}))
          else store.dispatch(toggleForm({ title: "Yes" }))

        }} >{state1.form && state1.form.title ? "Hide Student Form" : "Show Student Form"}</button>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  form: state.form
});

const mapDispatchToProps = dispatch => ({
  toggleForm: (dt) => dispatch(toggleForm(dt))
});

const ToggleForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(Form);

export default ToggleForm;