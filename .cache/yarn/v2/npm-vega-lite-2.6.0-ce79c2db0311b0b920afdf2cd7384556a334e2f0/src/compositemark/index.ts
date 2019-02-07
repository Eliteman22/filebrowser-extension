import {Config} from './../config';
import {AnyMark, isMarkDef} from './../mark';
import {GenericUnitSpec, NormalizedLayerSpec} from './../spec';
import {BOXPLOT, BoxPlotConfigMixins, BoxPlotDef, normalizeBoxPlot, VL_ONLY_BOXPLOT_CONFIG_PROPERTY_INDEX} from './boxplot';
import {ERRORBAR, normalizeErrorBar} from './errorbar';

// This package import below makes the generated .d.ts file compatible with
// Typescript 2.7 so that libraries requiring us can use Typedoc (which
// currently is limited to Typescript 2.7). This comment and import can be
// removed when Typedoc is updated to Typescript 2.9 or later. See
// https://github.com/vega/vega-lite/issues/3862 for more details.
import * as boxplot from './boxplot';

export {BoxPlotConfig} from './boxplot';
export type UnitNormalizer = (spec: GenericUnitSpec<any, any>, config: Config)=> NormalizedLayerSpec;

/**
 * Registry index for all composite mark's normalizer
 */
const normalizerRegistry: {[mark: string]: UnitNormalizer} = {};

export function add(mark: string, normalizer: UnitNormalizer) {
  normalizerRegistry[mark] = normalizer;
}

export function remove(mark: string) {
  delete normalizerRegistry[mark];
}

export type CompositeMark = BOXPLOT | ERRORBAR;

export type CompositeMarkDef = BoxPlotDef;

export type CompositeAggregate = BOXPLOT;

export const COMPOSITE_MARK_STYLES = boxplot.BOXPLOT_STYLES;
export type CompositeMarkStyle = typeof COMPOSITE_MARK_STYLES[0];

export interface CompositeMarkConfigMixins extends BoxPlotConfigMixins {}

export const VL_ONLY_COMPOSITE_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX = {
  ...VL_ONLY_BOXPLOT_CONFIG_PROPERTY_INDEX
};

add(BOXPLOT, normalizeBoxPlot);
add(ERRORBAR, normalizeErrorBar);

/**
 * Transform a unit spec with composite mark into a normal layer spec.
 */
export function normalize(
    // This GenericUnitSpec has any as Encoding because unit specs with composite mark can have additional encoding channels.
    spec: GenericUnitSpec<any, AnyMark>,
    config: Config
  ): NormalizedLayerSpec {

  const mark = isMarkDef(spec.mark) ? spec.mark.type : spec.mark;
  const normalizer = normalizerRegistry[mark];
  if (normalizer) {
    return normalizer(spec, config);
  }

  throw new Error(`Invalid mark type "${mark}"`);
}
