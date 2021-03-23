<template>
	<vca-relation-chain default-avatar="https://wyatest.oss-cn-hangzhou.aliyuncs.com//image/172/20190704/170051/c7a2bf5481a046af0b9a16f9286aa07c.png!4-4">
		<vca-relation-chain-item />
		<vca-relation-chain-item />
		<vca-relation-chain-item />
		<vca-relation-chain-item />
		<vca-relation-chain-item />
		<vca-relation-chain-item />
		<vca-relation-chain-item />
		<vca-relation-chain-item />
		<vca-relation-chain-item />
	</vca-relation-chain>
</template>

<script>
import RelationChain from '..';
import RelationChainItem from '../relation-chain-item';

export default {
	name: 'vca-basic',
	components: {
		'vca-relation-chain': RelationChain,
		'vca-relation-chain-item': RelationChainItem,
	}
};
</script>
<style lang="scss" scoped>
</style>
