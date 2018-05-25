/**
 * External dependencies
 */
import { every, get, isString, map, mapValues } from 'lodash';

/**
 * Internal dependencies
 */
import { createBlock } from './factory';
import { getBlockType } from '../api/registration';
import { parseWithAttributeSchema } from '../api/parser';

/**
 * Checks whether a list of blocks matches a template by comparing the block names.
 *
 * @param {Array} blocks    Block list.
 * @param {Array} template  Block template.
 *
 * @return {boolean}        Whether the list of blocks matches a templates
 */
export function doBlocksMatchTemplate( blocks = [], template = [] ) {
	return (
		blocks.length === template.length &&
		every( template, ( [ name, , innerBlocksTemplate ], index ) => {
			const block = blocks[ index ];
			return (
				name === block.name &&
				doBlocksMatchTemplate( block.innerBlocks, innerBlocksTemplate )
			);
		} )
	);
}

/**
 * Synchronize a block list with a block template.
 *
 * Synchronnizing a block list with a block template means that we loop over the blocks
 * keep the block as is if it matches the block at the same position in the template
 * (If it has the same name) and if doesn't match, we create a new block based on the template.
 * Extra blocks not present in the template are removed.
 *
 * @param {Array} blocks    Block list.
 * @param {Array} template  Block template.
 *
 * @return {Array}          Updated Block list.
 */
export function synchronizeBlocksWithTemplate( blocks = [], template = [] ) {
	return map( template, ( [ name, attributes, innerBlocksTemplate ], index ) => {
		const block = blocks[ index ];

		if ( block && block.name === name ) {
			const innerBlocks = synchronizeBlocksWithTemplate( block.innerBlocks, innerBlocksTemplate );
			return { ...block, innerBlocks };
		}

		const blockType = getBlockType( name );
		const attributesParsed = mapValues( attributes, ( attributeValue, attributeName ) => {
			if ( isString( attributeValue ) && 'array' === get( blockType, [ 'attributes', attributeName, 'type' ] ) ) {
				return parseWithAttributeSchema( attributeValue, {
					source: 'children',
				} );
			}
			return attributeValue;
		} );

		return createBlock(
			name,
			attributesParsed,
			synchronizeBlocksWithTemplate( [], innerBlocksTemplate )
		);
	} );
}
