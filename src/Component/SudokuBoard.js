import React, { Component } from "react";
import "./CSS/SudokuBoard.css";
import SudokuSection from "./SudokuSection.js";
import { SampleBoards } from "./SampleBoards.js";
import PropTypes from "prop-types";

export default class SudokuBoard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            Board: []
        };
    }

    componentDidMount() {
        let randomBoard = SampleBoards[Math.ceil(Math.random() * 2)];
        let actualBoard = [];
        for (let row = 0; row < randomBoard.length; row++) {
            let boardRows = [];
            for (let column = 0; column < randomBoard.length; column++) {
                boardRows.push({
                    value: randomBoard[row][column],
                    isSectionError: false,
                    isRowError: false,
                    isColumnError: false
                });
            }
            actualBoard.push(boardRows);
        }
        this.setState({ Board: actualBoard });
    }

    GetSectionBoard(sectionId) {
        let sectionBoard = [];
        let startColumn = (sectionId % 3) * 3;
        let startRow = sectionId - (sectionId % 3);

        for (let row = startRow; row < startRow + 3; row++) {
            for (let column = startColumn; column < startColumn + 3; column++) {
                sectionBoard.push(this.state.Board[row][column]);
            }
        }
        return sectionBoard;
    }

    handleChange = (e, sectionBoard) => {
        let boxId = e.target.attributes.box.value;
        let sectionId = e.target.attributes.section.value;
        let startColumn = (sectionId % 3) * 3;
        let startRow = sectionId - (sectionId % 3);
        let boxColumn = (sectionId % 3) * 3 + (boxId % 3);
        let boxRow = Math.floor(sectionId / 3) * 3 + Math.floor(boxId / 3);
        let board = this.state.Board;

        let count = 0;
        for (let row = startRow; row < startRow + 3; row++) {
            for (let column = startColumn; column < startColumn + 3; column++) {
                board[row][column] = sectionBoard[count];
                count++;
            }
        }

        let columnBoard = board.map(row => {
            return row[boxColumn];
        });
        count = 0;
        let cloneColumnBoard = columnBoard.slice();
        let columnValues = cloneColumnBoard.map(box => {
            return box.value;
        });
        columnBoard.forEach((box, i) => {
            if (box.value !== 0) {
                if (columnValues.indexOf(box.value) === columnValues.lastIndexOf(box.value)) {
                    cloneColumnBoard[i].isColumnError = false;
                } else {
                    cloneColumnBoard[i].isColumnError = true;
                }
            }
        });
        for (let row = 0; row < board.length; row++) {
            board[row][boxColumn] = cloneColumnBoard[count];
            count++;
        }

        let rowBoard = board[boxRow];
        count = 0;
        let cloneRowBoard = rowBoard.slice();
        let rowValues = cloneRowBoard.map(box => {
            return box.value;
        });
        rowBoard.forEach((box, i) => {
            if (box.value !== 0) {
                if (rowValues.indexOf(box.value) === rowValues.lastIndexOf(box.value)) {
                    cloneRowBoard[i].isRowError = false;
                } else {
                    cloneRowBoard[i].isRowError = true;
                }
            }
        });
        board[boxRow] = cloneRowBoard;

        this.setState({ Board: board });
    };

    GetBoard() {
        let sectionElement = [];
        for (let section = 0; section < 9; section++) {
            sectionElement.push(
                <SudokuSection
                    key={section}
                    sectionId={section}
                    sectionBoard={this.GetSectionBoard(section)}
                    onChange={this.handleChange}
                />
            );
        }
        return sectionElement;
    }

    render() {
        let isGameWon = true;
        this.state.Board.map(row => {
            return row.map(column => {
                return (column.value === 0 || column.errorValue) && (isGameWon = false);
            });
        });

        if (this.state.Board.length) {
            return (
                <React.Fragment>
                    <div className="board">{this.GetBoard()}</div>
                    {isGameWon && <h1 className="winner">Winner</h1>}
                </React.Fragment>
            );
        }
        return <div />;
    }
}
