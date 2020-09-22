<template>
	<div>
		<vca-section-title>
			title
		</vca-section-title>

		<vca-section-title content="title" />
	</div>
</template>

<script>
import SectionTitle from '..';

export default {
	name: 'vca-basic',
	components: {
		'vca-section-title': SectionTitle
	}
};
</script>

<style lang="scss" scoped>
</style>
