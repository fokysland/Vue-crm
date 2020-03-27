<template>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>{{ "Sum" | localize }}</th>
        <th>{{ "Date" | localize }}</th>
        <th>{{ "Category" | localize }}</th>
        <th>{{ "Type" | localize }}</th>
        <th>{{ "Open" | localize }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="record of records" :key="record.id">
        <td>{{ record.counter }}</td>
        <td>{{ record.amount | currency("RUB") }}</td>
        <td>{{ record.date | date("datetime") }}</td>
        <td>{{ record.categoryName }}</td>
        <td>
          <span class="white-text badge" :class="record.typeColor"
            >{{ record.typeText }}
          </span>
        </td>
        <td>
          <button
            class="btn-small btn"
            @click="$router.push(`/detail/${record.id}`)"
            :v-tooltip="tooltip"
          >
            <i class="material-icons">open_in_new</i>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script>
import localize from "@/filters/localize.filter";
export default {
  data: () => ({
    tooltip: localize("CheckRecord")
  }),
  props: {
    records: {
      required: true,
      type: Array
    }
  }
};
</script>
