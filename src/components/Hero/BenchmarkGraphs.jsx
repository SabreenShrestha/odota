import React from 'react';
import propTypes from 'prop-types';
import styled from 'styled-components';

import BenchmarkGraph from './BenchmarkGraph';
import constants from '../constants';

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 48px -8px;

  @media screen and (max-width: ${constants.wrapMobile}) {
    display: block;
    margin-left: 0;
    margin-right: 0;
  }
`;

const mapData = (data, key) => data.map(item => ({ Percentage: (`${item.percentile * 100}%`), Value: Number(item[key].toFixed(2)) }));

const getData = data => [
  { title: 'Gold per Minute', data: mapData(data, 'gold_per_min'), color: constants.golden },
  { title: 'XP per Minute', data: mapData(data, 'hero_damage_per_min'), color: constants.blue },
  { title: 'Hero Damage per Minute', data: mapData(data, 'hero_damage_per_min'), color: constants.red },
  { title: 'Hero Healing per Minute', data: mapData(data, 'hero_healing_per_min'), color: constants.green },
  { title: 'Kills per Minute', data: mapData(data, 'kills_per_min'), color: constants.yelor },
  { title: 'Last Hits per Minute', data: mapData(data, 'last_hits_per_min'), color: constants.colorBlueGray },
];

const renderGraphs = data => data.map(graphData => <BenchmarkGraph key={graphData.title} data={graphData} />);

const BenchmarkGraphs = ({ data }) => {
  const mappedData = getData(data);

  return (
    <Wrapper>
      { renderGraphs(mappedData) }
    </Wrapper>
  );
};

BenchmarkGraphs.propTypes = {
  data: propTypes.arrayOf(propTypes.shape({})),
};

export default BenchmarkGraphs;
