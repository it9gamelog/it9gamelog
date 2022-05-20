---
layout: default
title: Dates of Zodiac Signs and Solar Terms
---

<style>
  #year-selector {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  }
</style>

<p>Follow the links to the dates of different years</p>
<blockquote class="loading">Data is loading...</blockquote>
<p id="year-selector"></p>

<template id="year-cell">
  <span>
    <a href=""></a>
  </span>
</template>

<hr>
<script src="/solarterm/solarterm.js"></script>
<script>
    showYearSelector();
</script>
