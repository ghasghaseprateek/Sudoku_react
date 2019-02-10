import React, { Component } from "react";
import PropTypes from "prop-types";
import "./CSS/SudokuSection.css";
import _ from "lodash";

export default class SudokuSection extends Component {
    orginalSectionBoard = _.cloneDeep(this.props.sectionBoard);

    handleChange = e => {
        let value = parseInt(e.target.value);
        if (isNaN(value) && e.target.value !== "") {
            alert("Please enter only numbers");
            return;
        }
        if (!isNaN(value) && value.toString().length > 1) {
            return;
        }

        let sectionBoard = this.props.sectionBoard;
        sectionBoard[parseInt(e.target.attributes.box.value)] = {
            value: e.target.value === "" ? 0 : value
        };

        let cloneBoard = sectionBoard.slice();
        let sectionValues = cloneBoard.map(box => {
            return box.value;
        });
        sectionBoard.forEach((box, i) => {
            if (box.value !== 0) {
                if (sectionValues.indexOf(box.value) === sectionValues.lastIndexOf(box.value)) {
                    cloneBoard[i].isSectionError = false;
                } else {
                    cloneBoard[i].isSectionError = true;
                }
            }
        });

        this.props.onChange(e, cloneBoard);
    };

    render() {
        let boxes = [];
        for (let i = 0; i < this.props.sectionBoard.length; i++) {
            let className = "box";
            if (
                this.props.sectionBoard[i].isSectionError ||
                this.props.sectionBoard[i].isRowError ||
                this.props.sectionBoard[i].isColumnError
            ) {
                className += " error";
            }

            boxes.push(
                <input
                    key={i}
                    className={className}
                    section={this.props.sectionId}
                    box={i}
                    value={this.props.sectionBoard[i].value !== 0 ? this.props.sectionBoard[i].value : ""}
                    disabled={this.orginalSectionBoard[i].value !== 0}
                    onChange={this.handleChange}
                />
            );
        }
        return <div className="section">{boxes}</div>;
    }
}

SudokuSection.propTypes = {
    sectionId: PropTypes.number.isRequired,
    sectionBoard: PropTypes.any,
    onChange: PropTypes.func.isRequired
};
