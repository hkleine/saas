/* eslint-disable @typescript-eslint/no-non-null-assertion */
'use client';
import useLayout from '@/hooks/useLayout';
import { ConsultantWithEarnings, Roles } from '@/types/types';
import { useContext, useEffect } from 'react';
import ReactFlow, { Background, Controls, Edge, Node, ProOptions, useEdgesState, useNodesState } from 'reactflow';
import { ConsultantMenuContext } from '../Provider/ConsultantMenuProvider';
import { useGlobalStateContext } from '../Provider/GlobalStoreProvider';
import { ConsultantCard } from './ConsultantCard/ConsultantCard';
import PlaceholderEdge from './PlaceholderEdge';
import { useConsultantCallbacks } from './useConsultantCallbacks';

const nodeTypes = { consultant: ConsultantCard };
const edgeTypes = {
	placeholder: PlaceholderEdge,
};
const proOptions: ProOptions = { account: 'paid-pro', hideAttribution: true };

export default function Consultants({ roles }: { roles: Roles }) {
	const consultants = useGlobalStateContext((s) => s.consultants);
	useLayout();
	const callbacks = useConsultantCallbacks({ consultants });
	const { closeMenuCallback } = useContext(ConsultantMenuContext);

	useEffect(() => {
		const { nodes: layoutedNodes, edges: layoutedEdges } = getConsultantNodes(consultants, roles);
		setNodes(layoutedNodes);
		setEdges(layoutedEdges);
	}, [consultants, roles]);

	const { nodes: layoutedNodes, edges: layoutedEdges } = getConsultantNodes(consultants, roles);
	const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

	return (
		<ReactFlow
			onPaneClick={closeMenuCallback}
			onConnect={callbacks.onConnect}
			onNodesChange={onNodesChange}
			onEdgesChange={onEdgesChange}
			nodes={nodes}
			edges={edges}
			proOptions={proOptions}
			fitView
			nodeTypes={nodeTypes}
			edgeTypes={edgeTypes}
			maxZoom={1}
			nodesDraggable={true}
			zoomOnDoubleClick={false}
			// we are setting deleteKeyCode to null to prevent the deletion of nodes in order to keep the example simple.
			// If you want to enable deletion of nodes, you need to make sure that you only have one root node in your graph.
			deleteKeyCode={null}>
			<Background />
			<Controls />
		</ReactFlow>
	);
}

function getConsultantNodes(consultants: Array<ConsultantWithEarnings> | null, roles: Roles) {
	if (!consultants) return { nodes: [], edges: [] };

	const nodes = consultants.reduce((prevNodes: Array<Node>, currentConsultant: ConsultantWithEarnings) => {
		const nodesWithoutPlaceholder = [
			...prevNodes,
			{
				id: currentConsultant.id,
				type: 'consultant',
				position: { x: 0, y: 0 },
				data: { consultant: currentConsultant, otherConsultants: consultants, roles },
				draggable: true,
			},
		];
		return nodesWithoutPlaceholder;
	}, [] as Array<Node>);

	const edges = consultants.reduce((prevEdges: Array<Edge>, currentConsultant: ConsultantWithEarnings) => {
		const edges = prevEdges;

		if (currentConsultant.upline) {
			edges.push({
				id: currentConsultant.id,
				type: 'placeholder',
				target: currentConsultant.id,
				source: currentConsultant.upline,
			});
		}

		return edges;
	}, [] as Array<Edge>);

	return {
		nodes,
		edges,
	};
}
