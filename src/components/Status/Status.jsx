import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { fromNow, abbreviateNumber } from '../../utility';
import Table from '../Table';
import config from '../../config';
import CountUp from 'react-countup';

function jsonResponse(response) {
  return response.json();
}

const columns = [
  { displayName: 'key', field: 'key' },
  { displayName: 'value', field: 'value', displayFn: (row) => row.end != null ? <CountUp start={row.start} end={row.end} duration={10} delay={0} useEasing={false} /> : row.value },
];

const tableStyle = {
  flexGrow: 1,
  overflowX: 'auto',
  boxSizing: 'border-box',
  padding: '15px',
};

class Status extends React.Component {
  static propTypes = {
    strings: PropTypes.shape({}),
  }

  state = {
    result: {},
    last: {},
  }

  componentDidMount() {
    const update = () => fetch(`${config.VITE_API_HOST}/api/status`)
      .then(jsonResponse)
      .then(async (json) => {
        const nextState = { result: json, last: this.state.result };
        return this.setState(nextState);
      });
    update();
    setInterval(update, 10000);
  }
  render() {
    const { strings } = this.props;
    return (
      <div style={{
        display: 'flex', flexDirection: 'row', flexWrap: 'wrap', fontSize: '10px',
      }}
      >
        <Helmet title={strings.title_status} />
        <Table
          style={tableStyle}
          data={Object.keys(this.state.result)
            .filter((key) => typeof (this.state.result[key]) !== 'object')
            .map((key) => ({ key, value: this.state.result[key], start: this.state.last[key] ?? this.state.result[key], end: this.state.result[key] }))}
          columns={columns}
        />
        <Table
          style={tableStyle}
          data={Object.keys(this.state.result.health || {})
            .map((key) => ({
              key,
              value: `${abbreviateNumber(this.state.result.health[key].metric)}/${abbreviateNumber(this.state.result.health[key].threshold)}`,
            }))}
          columns={columns}
        />
        <Table
          style={tableStyle}
          data={(this.state.result.last_added || [])
            .map((match) => ({ key: match.match_id, value: fromNow(match.start_time + match.duration) }))}
          columns={columns}
        />
        <Table
          style={tableStyle}
          data={(this.state.result.last_parsed || [])
            .map((match) => ({ key: match.match_id, value: fromNow(match.start_time + match.duration) }))}
          columns={columns}
        />
        <Table
          style={tableStyle}
          data={Object.keys(this.state.result.load_times || {})
            .map((key) => ({ key, value: this.state.result.load_times[key] }))}
          columns={columns}
        />
        <Table
          style={tableStyle}
          data={(this.state.result.api_paths || [])
            .slice()
            .reverse()
            .map((row) => ({ key: row.hostname, value: row.count }))
          }
          columns={columns}
        />
        <Table
          style={tableStyle}
          data={(this.state.result.retriever || [])
            .slice()
            .reverse()
            .map(row => ({ key: row.hostname, value: row.count }))
          }
          columns={columns}
        />
      </div>);
  }
}

const mapStateToProps = state => ({
  strings: state.app.strings,
});

export default connect(mapStateToProps)(Status);
