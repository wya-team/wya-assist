<template>
	<vca-map id="map" ui style="height: 500px; width: 500px" />
</template>

<script>
import Map from '..';

export default {
	name: 'vca-basic',
	components: {
		'vca-map': Map,
	}
};
</script>
<style lang="scss" scoped>
</style>
