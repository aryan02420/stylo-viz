<script lang="ts">
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import _, { keys, template } from 'underscore';
  import data from '../../../stylometric-analysis/output/plot_all.json';

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

  let selected = 'unknown';

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

  const author = [...Array.from(new Set(Object.keys(data).map((x) => x.split('.')[0]))), 'unknown'];

  function getSeries(name: string) {
    return [
      ...Object.entries(data).map(([key, val]) => [key, val[name]]),
      ['unknown', unknown[name]],
    ];
  }

  function getChart(name: string) {
    const temp = d3
      .select('#' + name)
      .attr('width', width)
      .attr('height', height);
    temp.append('text').text(name).attr('y', 15).attr('x', 5);
    return temp.selectAll('path').data(getSeries(name));
  }

  function plotLine(
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

        let y = d[1];
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
      .attr('stroke', (d) => {
        const a = d[0].split('.')[0];
        const i = author.indexOf(a);
        if (selected === 'unknown') {
          if (a !== 'unknown') return colors[i] + '11';
          return '#000000ff';
        } else {
          if (a === selected) return colors[i] + '11';
          if (a !== 'unknown') return '#ffffff00';
          return '#000000ff';
        }
      })
      .attr('stroke-width', '2px')
      .attr('data-type', 'median')
      .attr('data-author', (d, i) => author[i])
      .attr('title', (d, i) => author[i]);

    selection.exit().remove();
  }

  function plotPoint(
    selection: d3.Selection<d3.EnterElement, any, d3.BaseType, unknown>,
    range: [number, number]
  ) {
    selection
      .enter()
      .append('path')
      // @ts-ignore
      .merge(selection)
      .attr('d', (d) => {
        const walkX = d3
          .scaleLinear()
          .domain([0, 1])
          .range([10, width - 10]);
        const walkY = d3
          .scaleLinear()
          .domain([range[0], range[1]])
          .range([height - 10, 10]);

        console.log({ d });

        let y = [d[1], d[1]];
        let x = [0, 1];

        return d3
          .line()
          .x((d) => walkX(d[0]))
          .y((d) => walkY(d[1]))(
          // @ts-ignore
          _.zip(x, y)
        );
      })
      .attr('fill', 'transparent')
      .attr('stroke', (d) => {
        const a = d[0].split('.')[0];
        const i = author.indexOf(a);
        if (selected === 'unknown') {
          if (a !== 'unknown') return colors[i] + '44';
          return '#000000ff';
        } else {
          if (a === selected) return colors[i] + '44';
          if (a !== 'unknown') return '#ffffff00';
          return '#000000ff';
        }
      })
      .attr('data-type', 'median')
      .attr('data-author', (d, i) => author[i]);

    selection.exit().remove();
  }

  function update() {
    console.log('updated');
    unknown = JSON.parse(unknown_str);
    let chart;
    chart = getChart('common_words_distribution');
    plotLine(chart, [0, 99, 0, 0.1]);
    chart = getChart('punct_distribution');
    plotLine(chart, [0, 12, 0, 0.1]);
    chart = getChart('stop_words_distribution');
    plotLine(chart, [0, 178, 0, 0.2]);
    chart = getChart('word_len_distribution');
    plotLine(chart, [0, 14, 0, 0.3]);
    chart = getChart('filtered_word_len_distribution');
    plotLine(chart, [0, 14, 0, 0.3]);
    chart = getChart('stop_word_len_distribution');
    plotLine(chart, [0, 14, 0, 0.5]);
    chart = getChart('tag_distribution');
    plotLine(chart, [0, 44, 0, 0.2]);
    chart = getChart('av_words_per_sent');
    plotPoint(chart, [0, 60]);
    chart = getChart('av_words_per_para');
    plotPoint(chart, [0, 200]);
  }

  onMount(update);
</script>

<div class="mx-auto max-w-3xl shadow-xl rounded-md mb-16">
  <textarea class="w-full h-72" bind:value={unknown_str} on:input={update} />
</div>
<div>
  <select bind:value={selected} on:change={update}>
    {#each author as a, i}
      <option value={a}>{a}</option>
    {/each}
  </select>
</div>
<div
  class="fixed right-2 bottom-2 py-1 px-2 bg-white/50 border border-gray-600 rounded-md backdrop-blur-sm"
>
  <ul class="text-xs list-disc list-inside">
    {#each author as a, i}
      <li style="color:{colors[i]}">
        {a}
      </li>
    {/each}
  </ul>
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
