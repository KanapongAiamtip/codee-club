<template>
  <section class="section placeholder">
    <div class="container content">
      <h1>Debug Route</h1>
      <table>
        <tr>
          <td>Component:</td>
          <td>{{ $route.name }}</td>
        </tr>
        <tr>
          <td>Path:</td>
          <td>{{ $route.path }}</td>
        </tr>
        <tr>
          <td>
            Params:<br>
            <ul>
              <li
                v-for="(value, key) in $route.params"
                :key="key"
                class="param"
              >
                {{ key }}
              </li>
            </ul>
          </td>
          <td>
            <br>
            <ul>
              <li
                v-for="(value, key) in $route.params"
                :key="key"
              >
                {{ value }}
              </li>
            </ul>
          </td>
        </tr>
        <tr>
          <td>User:</td>
          <td>
            <span v-if="user">{{ user.name }} [{{ user.id }}]</span>
            <span v-else>Logged out</span>
          </td>
        </tr>
        <tr>
          <td>
            State:<br>
            <ul>
              <li
                v-for="(value, key) in $store.state"
                :key="key"
                class="param"
              >
                {{ key }}
              </li>
            </ul>
          </td>
          <td>
            <br>
            <ul>
              <li
                v-for="(value, key) in $store.state"
                :key="key"
              >
                <span v-if="value">{{ JSON.stringify(value) }}</span><span v-else>-</span>
              </li>
            </ul>
          </td>
        </tr>
      </table>
    </div>
  </section>
</template>

<script lang="ts" src="./Debug.ts"></script>

<style lang="scss" scoped>
.placeholder p {
  margin: 0;
}
.placeholder tr td:first-child {
  width: 160px;
  color: #999;
}
.placeholder tr td:last-child {
  max-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.placeholder ul {
  margin: 0;
  list-style-type: none;
}
.placeholder ul li {
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.placeholder ul .param {
  margin-left: 16px;
}
</style>
