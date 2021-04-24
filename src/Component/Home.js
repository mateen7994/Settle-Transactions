import React, { useState, } from 'react'
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableCell,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Grid,
} from '@material-ui/core'
import { Graph } from 'react-d3-graph'
import Expense from '../classes/expense'
import { splitwise } from '../utils/splitwise'

const Home = () => {
  const [name, setName] = useState('')
  const [allNames, setAllNames] = useState([])
  const [flag, setFlag] = useState(false)
  const [finalValues, setFinalValues] = useState({
    "person1": "",
    "person2": "",
    "amount": ""
  })
  const [items, setItems] = useState([])
  const [outputList, setOutputList] = useState([])

  const { person1, person2, amount } = finalValues;

  const [inputGraphData, setInputGraphData] = useState({})
  const [inputGraphConfig, setInputGraphConfig] = useState({})

  const [outputGraphData, setOutputGraphData] = useState({})

  const handleFinalChange = name => event => {
    setFinalValues({ ...finalValues, [name]: event.target.value })
  }


  const handleChange = (event) => {
    setName(event.target.value)
  }

  const addParticipant = event => {
    event.preventDefault();
    setAllNames(previous => [{ name }, ...previous])
    setName('')
  }

  const listOfNames = () => {
    return (
      <div className="allnames">
        <h3>Names</h3>

        {allNames.map((item, index) => (
          <h4 style={{ color: "#3f3f3f" }} key={index}> { item.name}</h4>
        ))
        }
      </div>
    )
  }

  const handleOpenForm = () => {
    setFlag(!false)
  }

  const myForm = () => {
    function addValues() {
      if ((finalValues['person1'] !== "") && (finalValues['person2'] !== "") && (finalValues['amount'] !== "")) {
        setItems([...items, finalValues])
      } else {
        alert("Enter all Fields")
      }
      setFinalValues({
        ...finalValues,
        "person1": "",
        "person2": "",
        "amount": ""
      })
    }
    return (
      <TableContainer component={Paper} className="table">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Payer</TableCell>
              <TableCell align="center">Payee</TableCell>
              <TableCell align="center">Amount</TableCell>
              <TableCell align="center">Add</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length > 0 && items.map((row) => (
              <TableRow key={row.name}>
                <TableCell component="th" align="center" scope="row">
                  {row.person1}
                </TableCell>
                <TableCell align="center">{row.person2}</TableCell>
                <TableCell align="center">{row.amount}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell align="center">
                <FormControl>
                  <InputLabel>Payer</InputLabel>
                  <Select value={person1} onChange={handleFinalChange("person1")}>
                    {allNames.map(item => (
                      <MenuItem value={item.name} >{item.name}</MenuItem>
                    ))
                    }
                  </Select>
                </FormControl>
              </TableCell>


              <TableCell align="center">
                <FormControl>
                  <InputLabel>Payee</InputLabel>
                  <Select value={person2} onChange={handleFinalChange("person2")}>
                    {allNames.map(item =>
                    ((person1 !== item.name) ? <MenuItem value={item.name}>{item.name}</MenuItem> : <></>
                    ))
                    }
                  </Select>
                </FormControl>
              </TableCell>


              <TableCell align="center">
                <FormControl>
                  <TextField
                    id="standard-number"
                    label="Amount"
                    type="number"
                    value={amount}
                    placeholder="Emter Amount"
                    onChange={handleFinalChange("amount")}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </FormControl>
              </TableCell>


              <TableCell align="center">
                <Button
                  size="small"
                  variant="outlined"
                  color="primary"
                  onClick={(e) => { addValues() }}
                >
                  + ADD
                </Button>

              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    )
  }

  const handleTransactionDataSubmit = () => {
    console.log("Participants: ", allNames, " transactions: ", items)
    const data = {
      nodes: generateNodes(),
      links: generateLinks(),
    }
    const config = {
      freezeAllDragEvents: true,
      nodeHighlightBehavior: true,
      node: {
        color: "lightgreen",
        highlightStrokeColor: "blue"
      },
      link: {
        highlightColor: "lightblue",
        renderLabel: true,
        labelProperty: "amount",
      },
      directed: true,
      height: 500,
      width: 500,
    };

    setInputGraphData(data)
    setInputGraphConfig(config)
  }

  const generateNodes = () => allNames.map(item => ({ id: item.name }))

  const generateLinks = () => items.map(({ person1, person2, amount }) => ({ source: person1, target: person2, amount }))

  const generateOutputLinks = (items) => items.map(({ person1, person2, amount }) => ({ source: person1, target: person2, amount }))

  const splitwiseTransactions = () => {
    const input = []
    for (let item of items) {
      input.push(new Expense(item.person1, item.person2, parseInt(item.amount)))
    }
    const output = splitwise(input)
    console.log('output: ', output)
    setOutputList(output)
    setOutputGraphData({ nodes: generateNodes(), links: generateOutputLinks(output) })
  }

  return (
    <div>
      <div className="name-component">
        <div className="p-name">
          <h2>Enter Participant's name</h2>
          <div className="p-name-field">
            <TextField id="outlined-basic" label="Participant Name"
              variant="outlined"
              value={name}
              disabled={flag}
              onChange={handleChange} />
          </div>
          <Button variant="contained"
            color="primary"
            onClick={addParticipant}
          >
            Add
                </Button>
        </div>
        {allNames && allNames.length ? (
          <>
            <div className="list-div">
              <div className="list-all-names">
                {listOfNames()}
              </div>
            </div>
            <Button variant="contained" color="secondary" onClick={handleOpenForm}>Submit</Button>
          </>
        ) : null}

      </div>

      <Grid container>
        <Grid item xs={6}>
          <div className="form">
            {flag && myForm()}
          </div>

          {items && items.length ? (
            <div className="form-names">
              <Button variant="contained" color="primary" onClick={handleTransactionDataSubmit}>Submit Data</Button>
              <Button variant="contained" color="secondary" onClick={splitwiseTransactions}>Run</Button>
            </div>
          ) : null}
        </Grid>

        <Grid item xs={6}>
          {Object.keys(inputGraphData).length && Object.keys(inputGraphConfig).length ? (
            <Graph
              id="graph-id" // id is mandatory
              data={inputGraphData}
              config={inputGraphConfig}
            />
          ) : null}
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={6}>
          {
            outputList && outputList.length ? (
              <>
                <h3> Simplified Transactions</h3>
                <TableContainer component={Paper} className="table">
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">Payer</TableCell>
                        <TableCell align="center">Payee</TableCell>
                        <TableCell align="center">Amount</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {outputList.length && outputList.map((row) => (
                        <TableRow key={row.name}>
                          <TableCell component="th" align="center" scope="row">
                            {row.person1}
                          </TableCell>
                          <TableCell align="center">{row.person2}</TableCell>
                          <TableCell align="center">{row.amount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            ) : null
          }
        </Grid>
        <Grid item xs={6}>
          {
            Object.keys(outputGraphData).length && Object.keys(inputGraphConfig).length ? (
              <Graph
                id="graph-id-output" // id is mandatory
                data={outputGraphData}
                config={inputGraphConfig}
              />
            ) : null
          }
        </Grid>
      </Grid>
    </div>
  )
}

export default Home