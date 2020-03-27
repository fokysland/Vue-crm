<template>
  <ul class="sidenav app-sidenav" :class="{ open: value }">
    <router-link
      v-for="link in links"
      :key="link.url"
      tag="li"
      active-class="active"
      :to="link.url"
      :exact="link.exact"
    >
      <a href="#" class="waves-effect waves-orange pointer">{{ link.title }}</a>
    </router-link>
  </ul>
</template>

<script>
import localize from "@/filters/localize.filter";
export default {
  props: ["value"],
  data: () => ({
    links: [
      { title: localize("Bill"), url: "/", exact: true },
      { title: localize("History"), url: "/history" },
      { title: localize("Planning"), url: "/planning" },
      { title: localize("NewRecord"), url: "/record" },
      { title: localize("Categories"), url: "/categories" }
    ]
  })
};
</script>
