<script lang="ts">
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import _, { template } from 'underscore';
  import data from '../../../stylometric-analysis/output/plot.json';

  let unknown = {
    common_words_distribution: new Array(100).fill(0),
    punct_distribution: new Array(13).fill(0),
    stop_words_distribution: new Array(179).fill(0),
    word_len_distribution: new Array(15).fill(0),
    filtered_word_len_distribution: new Array(15).fill(0),
    stop_word_len_distribution: new Array(15).fill(0),
    tag_distribution: new Array(45).fill(0),
    av_words_per_sent: 0,
    av_words_per_para: 0,
  };
  let unknown_str = JSON.stringify(unknown, null, 2);

  console.log(data);

  const width = 400;
  const height = 400;

  const colors = [
    '#e60049',
    '#0bb4ff',
    '#50e991',
    '#e6d800',
    '#9b19f5',
    '#ffa300',
    '#dc0ab4',
    '#b3d4ff',
    '#00bfa0',
  ];

  const author = Object.keys(data);

  function getSeries(name: string) {
    const uk = new Array(5).fill(unknown[name]);
    return [...author.map((x) => data[x][name]), uk];
  }

  function getChart(name: string) {
    const temp = d3
      .select('#' + name)
      .attr('width', width)
      .attr('height', height);
    temp.append('text').text(name).attr('y', 15).attr('x', 5);
    return temp.selectAll('path').data(getSeries(name));
  }

  function plotMedian(
    selection: d3.Selection<d3.EnterElement, any, d3.BaseType, unknown>,
    range: [number, number, number, number]
  ) {
    selection
      .enter()
      .append('path')
      // @ts-ignore
      .merge(selection)
      .attr('d', (d) => {
        const walkX = d3
          .scaleLinear()
          .domain([range[0], range[1]])
          .range([10, width - 10]);
        const walkY = d3
          .scaleLinear()
          .domain([range[2], range[3]])
          .range([height - 10, 10]);

        let y = d[2];
        let x = [...Array(y.length).keys()];

        return d3
          .line()
          .x((d) => walkX(d[0]))
          .y((d) => walkY(d[1]))(
          // @ts-ignore
          _.zip(x, y)
        );
      })
      .attr('fill', 'transparent')
      .attr('stroke', (d, i) => colors[i])
      .attr('stroke-width', '2px')
      .attr('class', (d, i) => `${author[i]} median`);

    selection.exit().remove();
  }

  function plotIQR(
    selection: d3.Selection<d3.EnterElement, any, d3.BaseType, unknown>,
    range: [number, number, number, number]
  ) {
    selection
      .enter()
      .append('path')
      // @ts-ignore
      .merge(selection)
      .attr('d', (d) => {
        const walkX = d3
          .scaleLinear()
          .domain([range[0], range[1]])
          .range([10, width - 10]);
        const walkY = d3
          .scaleLinear()
          .domain([range[2], range[3]])
          .range([height - 10, 10]);

        let y1 = d[1];
        let y3 = d[3];
        let x = [...Array(y1.length).keys()];

        let top = _.zip(x, y3);
        let bottom = _.zip(x, y1);

        return d3
          .line()
          .x((d) => walkX(d[0]))
          .y((d) => walkY(d[1]))(
          // @ts-ignore
          [...top, ...bottom.reverse()]
        );
      })
      .attr('fill', (d, i) => colors[i])
      .attr('stroke', 'transparent')
      .attr('class', (d, i) => `${author[i]} iqr`);

    selection.exit().remove();
  }

  function update() {
    console.log('updated');
    unknown = JSON.parse(unknown_str);
    let chart;
    chart = getChart('common_words_distribution');
    plotIQR(chart, [0, 99, 0, 0.6]);
    plotMedian(chart, [0, 99, 0, 0.6]);
    chart = getChart('punct_distribution');
    plotIQR(chart, [0, 12, 0, 0.3]);
    plotMedian(chart, [0, 12, 0, 0.3]);
    chart = getChart('stop_words_distribution');
    plotIQR(chart, [0, 178, 0, 1.2]);
    plotMedian(chart, [0, 178, 0, 1.2]);
    chart = getChart('word_len_distribution');
    plotIQR(chart, [0, 14, 0, 1.1]);
    plotMedian(chart, [0, 14, 0, 1.1]);
    chart = getChart('filtered_word_len_distribution');
    plotIQR(chart, [0, 14, 0, 1.1]);
    plotMedian(chart, [0, 14, 0, 1.1]);
    chart = getChart('stop_word_len_distribution');
    plotIQR(chart, [0, 14, 0, 1.1]);
    plotMedian(chart, [0, 14, 0, 1.1]);
    chart = getChart('tag_distribution');
    plotIQR(chart, [0, 44, 0, 1.1]);
    plotMedian(chart, [0, 44, 0, 1.1]);
  }

  onMount(update);
</script>

<div class="mx-auto max-w-3xl shadow-xl rounded-md mb-16">
  <textarea class="w-full h-72" bind:value={unknown_str} on:input={update} />
</div>
<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 w-max mx-auto">
  <svg id="common_words_distribution" />
  <svg id="punct_distribution" />
  <svg id="stop_words_distribution" />
  <svg id="word_len_distribution" />
  <svg id="filtered_word_len_distribution" />
  <svg id="stop_word_len_distribution" />
  <svg id="tag_distribution" />
  <svg id="av_words_per_sent" />
  <svg id="av_words_per_para" />
</div>

<style scoped lang="postcss">
  :global(body) {
    @apply m-4 bg-warmGray-50;
  }

  :global(svg) {
    @apply border-2 border-gray-600 rounded-md m-2 bg-white;
  }

  :global(.iqr) {
    @apply opacity-5;
    position: relative;
    z-index: 1;
  }
  :global(.median) {
    position: relative;
    z-index: 0;
  }
  :global(.median:hover) {
    stroke-width: 4px;
    z-index: 99;
  }
</style>
