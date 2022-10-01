/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {useResource} from '@clayui/data-provider';
import {
	FetchPolicy,
	NetworkStatus,
} from '@clayui/data-provider/src/useResource';
import ClayDropDown from '@clayui/drop-down';
import {FocusScope, useDebounce} from '@clayui/shared';
import React, {useEffect, useRef, useState} from 'react';

import ClayAutocomplete from '../src';

const LoadingWithDebounce = ({
	loading,
	networkStatus,
	render,
}: {
	networkStatus?: NetworkStatus;
	loading: boolean;
	render: any;
}) => {
	const debouncedLoadingChange = useDebounce(loading, 500);

	if (networkStatus === 1 || debouncedLoadingChange) {
		return (
			<ClayDropDown.Item className="disabled">
				Loading...
			</ClayDropDown.Item>
		);
	}

	return render;
};

export default {
	title: 'Design System/Components/Autocomplete',
};

export const Default = (args: any) => (
	<div className="row">
		<div className="col-md-5">
			<div className="sheet">
				<div className="form-group">
					<label
						htmlFor="clay-autocomplete-1"
						id="clay-autocomplete-label-1"
					>
						Numbers (one-five)
					</label>
					<ClayAutocomplete
						aria-labelledby="clay-autocomplete-label-1"
						id="clay-autocomplete-1"
						menuTrigger={args.menuTrigger}
						messages={{
							loading: 'Loading...',
							notFound: 'No results found',
						}}
						placeholder="Enter a number from One to Five"
					>
						{['one', 'two', 'three', 'four', 'five'].map((item) => (
							<ClayAutocomplete.Item key={item}>
								{item}
							</ClayAutocomplete.Item>
						))}
					</ClayAutocomplete>
				</div>
			</div>
		</div>
	</div>
);

Default.argTypes = {
	menuTrigger: {
		control: {type: 'select'},
		options: ['focus', 'input'],
	},
};

export const Dynamic = () => (
	<div className="row">
		<div className="col-md-5">
			<div className="sheet">
				<div className="form-group">
					<label
						htmlFor="clay-autocomplete-1"
						id="clay-autocomplete-label-1"
					>
						Numbers (one-five)
					</label>
					<ClayAutocomplete
						aria-labelledby="clay-autocomplete-label-1"
						defaultItems={['one', 'two', 'three', 'four', 'five']}
						id="clay-autocomplete-1"
						messages={{
							loading: 'Loading...',
							notFound: 'No results found',
						}}
						placeholder="Enter a number from One to Five"
					>
						{(item) => (
							<ClayAutocomplete.Item key={item}>
								{item}
							</ClayAutocomplete.Item>
						)}
					</ClayAutocomplete>
				</div>
			</div>
		</div>
	</div>
);

export const AsyncFilter = () => {
	const [value, setValue] = useState('');

	const [networkStatus, setNetworkStatus] = useState<NetworkStatus>(
		NetworkStatus.Unused
	);
	const {resource} = useResource({
		fetchPolicy: FetchPolicy.CacheFirst,
		link: 'https://rickandmortyapi.com/api/character/',
		onNetworkStatusChange: setNetworkStatus,
		variables: {name: value},
	});

	return (
		<div className="row">
			<div className="col-md-5">
				<div className="sheet">
					<div className="form-group">
						<label
							htmlFor="clay-autocomplete-1"
							id="clay-autocomplete-label-1"
						>
							Name
						</label>
						<ClayAutocomplete
							aria-labelledby="clay-autocomplete-label-1"
							id="clay-autocomplete-1"
							isLoading={networkStatus < NetworkStatus.Unused}
							items={resource?.results ?? []}
							messages={{
								loading: 'Loading...',
								notFound: 'No results found',
							}}
							onChange={setValue}
							onItemsChange={() => {}}
							placeholder="Enter a name"
							value={value}
						>
							{(item) => (
								<ClayAutocomplete.Item key={item.id}>
									{item.name}
								</ClayAutocomplete.Item>
							)}
						</ClayAutocomplete>
					</div>
				</div>
			</div>
		</div>
	);
};

export const Keyboard = () => {
	const inputRef = useRef<HTMLInputElement | null>(null);
	const [value, setValue] = useState('');
	const [active, setActive] = useState(!!value);

	const filteredItems = ['one', 'two', 'three', 'four', 'five'].filter(
		(item) => item.match(value)
	);

	useEffect(() => {
		setActive(!!value);
	}, [value]);

	return (
		<div className="row">
			<div className="col-md-5">
				<div className="sheet">
					<div className="form-group">
						<label>Numbers (one-five)</label>
						<FocusScope>
							<ClayAutocomplete>
								<ClayAutocomplete.Input
									aria-label="Numbers: Enter a number from One to Five"
									onChange={(event: any) =>
										setValue(event.target.value)
									}
									ref={inputRef}
									value={value}
								/>

								<ClayAutocomplete.DropDown
									active={active}
									onActiveChange={setActive}
								>
									<ClayDropDown.ItemList>
										{filteredItems.map((item) => (
											<ClayAutocomplete.Item
												key={item}
												match={value}
												onClick={() => setValue(item)}
												value={item}
											/>
										))}
									</ClayDropDown.ItemList>
								</ClayAutocomplete.DropDown>
							</ClayAutocomplete>
						</FocusScope>
					</div>
				</div>
			</div>
		</div>
	);
};

export const AsyncData = () => {
	const [value, setValue] = useState('');
	const [networkStatus, setNetworkStatus] = useState<NetworkStatus>(
		NetworkStatus.Unused
	);
	const {resource} = useResource({
		fetchPolicy: FetchPolicy.CacheFirst,
		link: 'https://rickandmortyapi.com/api/character/',
		onNetworkStatusChange: setNetworkStatus,
		variables: {name: value},
	});

	const initialLoading = networkStatus === 1;
	const loading = networkStatus < 4;
	const error = networkStatus === 5;

	return (
		<div className="row">
			<div className="col-md-5">
				<div className="sheet">
					<div className="form-group">
						<label>Name</label>
						<ClayAutocomplete>
							<ClayAutocomplete.Input
								aria-label="Enter a name:"
								onChange={(event: any) =>
									setValue(event.target.value)
								}
								value={value}
							/>

							<ClayAutocomplete.DropDown
								active={
									(!!resource && !!value) || initialLoading
								}
							>
								<ClayDropDown.ItemList>
									<LoadingWithDebounce
										loading={loading}
										networkStatus={networkStatus}
										render={
											<>
												{(error ||
													(resource &&
														resource.error)) && (
													<ClayDropDown.Item className="disabled">
														No Results Found
													</ClayDropDown.Item>
												)}
												{!error &&
													resource &&
													resource.results &&
													resource.results.map(
														(item: any) => (
															<ClayAutocomplete.Item
																key={item.id}
																match={value}
																onClick={() =>
																	setValue(
																		item.name
																	)
																}
																value={
																	item.name
																}
															/>
														)
													)}
											</>
										}
									/>
								</ClayDropDown.ItemList>
							</ClayAutocomplete.DropDown>
							{loading && <ClayAutocomplete.LoadingIndicator />}
						</ClayAutocomplete>
					</div>
				</div>
			</div>
		</div>
	);
};
