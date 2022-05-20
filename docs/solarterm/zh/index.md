---
layout: default
title: 回歸黃道宮和二十四節氣日期
redirect_from:
  - /solarterm/
---

<style>
  #year-selector {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  }
</style>

<p>前往不同年份的日期資料</p>
<blockquote class="loading">資料加載中，請稍候。</blockquote>
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
